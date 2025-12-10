const express = require("express");
const path = require("path");
const cors = require("cors")

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname))); 

app.post("/login", async (req, res) => {
    try {
        
        const { nome, senha } = req.body

        if (!nome || !senha) {
            return res.status(400).json({
                message: "O campo de usuário ou senha não foi preenchido!"
            });
        }

        if (nome !== "admin" || senha !== "123456") {
            return res.status(401).json({
                message: "O nome de usuário ou senha está incorreto ou não foi cadastrado!"
            });
        }

        return res.status(200).json({
            id: 1,
            nome: "admin",
            email: "admin@email.com"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Falha na comunicação com o servidor!",
            error: String(error)
        });
    }
});

app.get("/vehicles", (req, res) => {
    try {
        const vehicles = [
            {
                id: 1,
                vehicle: "Ranger",
                volumetotal: 145760,
                connected: 70000,
                softwareUpdates: 27550,
                img: "/img/ranger.png" 
            },
            {
                id: 2,
                vehicle: "Mustang",
                volumetotal: 1500,
                connected: 500,
                softwareUpdates: 750,
                img: "/img/mustang.png"
            },
            {
                id: 3,
                vehicle: "Territory",
                volumetotal: 4560,
                connected: 4000,
                softwareUpdates: 3050,
                img: "/img/territory.png"
            },
            {
                id: 4,
                vehicle: "Bronco Sport",
                volumetotal: 7560,
                connected: 4060,
                softwareUpdates: 2050,
                img: "/img/broncoSport.png"
            }
        ];

        return res.status(200).json({ vehicles });

    } catch (error) {
        return res.status(500).json({
            message: "Falha na comunicação com o servidor!"
        });
    }
});

app.post("/vehicleData", (req, res) => {
    try {
        const { vin } = req.body

        switch (vin) {
            case "2FRHDUYS2Y63NHD22454":
                return res.status(200).json({
                    id: 1,
                    odometro: 23344,
                    nivelCombustivel: 76,
                    status: "on",
                    lat: -12.2322,
                    long: -35.2314
                });
                
            // ... (outros casos) ...
            
            default:
                return res.status(400).json({
                    message: "Código VIN utilizado não foi encontrado!"
                });
        }


    } catch (error) {
        return res.status(500).json({
            message: "Falha na comunicação com o servidor!"
        });
    }
})

module.exports = app;