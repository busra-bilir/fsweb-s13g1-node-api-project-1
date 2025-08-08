// SUNUCUYU BU DOSYAYA KURUN
const express = require('express');
const { find, findById, insertt, remove } = require("./users/model"); // Kullanıcı modelini içe aktar

const server = express();
server.use(express.json()); // JSON gövdesini ayrıştırmak için middleware ekle

server.get('/', (req, res) => {
    res.send("Server running as expectec...");
});

server.get("/api/users", async (req, res) => {
    try {
    const users = await find(); // find() fonksiyonunu kullanarak kullanıcıları al
    res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Kullanıcı bilgileri alınamadı" });
    }
});

server.get("/api/users/:id", async (req, res) => {
    const {id} = req.params;
    const user = await findById(id);
    if (!user) {
        return res.status(404).json({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
    }    
    res.status(200).json(user);
    });

server.post("/api/users", async (req, res) => {
    try {
        const { bio, name } = req.body;
        if (!bio || !name) {
            return res.status(400).json({ message: "Lütfen kullanıcı için bir name ve bio sağlayın " });
        }
        const newUser = await insertt({ bio: bio, name: name });
        res.status(201).json(newUser); // Başarılı bir şekilde oluşturulduğunu belirt
    } catch (error) {
        res.status(500).json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
    }
});
server.delete("/api/users/:id", async (req, res) => {
    
    try {
        const { id } = req.params;
        const removedUser = await remove(id);
        if (removedUser) {
        res.status(200).json(removedUser);
        } else {
            res
            .status(404).json({ message: "Belirtilen ID li kullanıcı bulunamadı" });
        }
        } catch (error) {
        res.status(500).json({ message: "Kullanıcı silinirken bir hata oluştu" });
    }
});

server.put("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    const { bio, name } = req.body;

    if (!bio || !name) {
        return res.status(400).json({ message: "Lütfen kullanıcı için bir name ve bio sağlayın" });
    }

    try {
        const updatedUser = await findById(id);
        if (!updatedUser) {
            return res.status(404).json({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
        }
        updatedUser.bio = bio;
        updatedUser.name = name;
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Kullanıcı bilgileri güncellenemedi" });
    }
});
module.exports = server; // SERVERINIZI EXPORT EDİN {}
