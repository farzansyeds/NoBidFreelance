const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid or expired token." });
        req.user = user;
        next();
    });
};

app.post('/signup', async (req, res) => {
    const { email, password, name, role, skills } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name, role, skills: skills || [] }
        });
        res.json({ message: "User created!", userId: user.id });
    } catch (err) {
        res.status(400).json({ error: "Email already exists or invalid data" });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ message: "Login successful!", token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/post-project", authenticateToken, async (req, res) => {
    const { title, description, budget, requiredSkills } = req.body;
    try {
        const newProject = await prisma.project.create({
            data: {
                title,
                description,
                budget: parseFloat(budget),
                requiredSkills,
                client: { connect: { id: req.user.userId } },
            },
        });

        const matchedFreelancers = await prisma.user.findMany({
            where: {
                role: "FREELANCER",
                skills: { hasSome: requiredSkills },
            },
        });

        const invitations = await Promise.all(
            matchedFreelancers.map((freelancer) =>
                prisma.invitation.create({
                    data: { projectId: newProject.id, freelancerId: freelancer.id, status: "PENDING" },
                })
            )
        );

        res.status(201).json({ message: "Project created and matches invited!", project: newProject, invitationsSent: invitations.length });
    } catch (error) {
        res.status(400).json({ error: "Project creation failed", details: error.message });
    }
});

app.get("/my-invites", authenticateToken, async (req, res) => {
    try {
        const invites = await prisma.invitation.findMany({
            where: { freelancerId: req.user.userId, status: "PENDING" },
            include: { project: true },
        });
        res.json(invites);
    } catch (error) {
        res.status(500).json({ error: "Could not fetch invites" });
    }
});

app.patch("/invitation/:id", authenticateToken, async (req, res) => {
    const { status } = req.body;
    try {
        const invite = await prisma.invitation.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!invite || invite.freelancerId !== req.user.userId) {
            return res.status(403).json({ error: "Not your invitation!" });
        }
        const updated = await prisma.invitation.update({
            where: { id: parseInt(req.params.id) },
            data: { status },
        });
        res.json({ message: `Success! Project is now ${status}`, updated });
    } catch (error) {
        res.status(500).json({ error: "Update failed" });
    }
});

app.get('/', (req, res) => { res.send('No-Bid Server is running and Prisma is connected!'); });
app.listen(PORT, () => { console.log(`Server is active on http://localhost:${PORT}`); });