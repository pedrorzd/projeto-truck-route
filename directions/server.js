const express = require('express');
const app = express();
const directions = require('./directions');

app.use(express.static('public'));

app.get('/get-directions', async (req, res) => {
    const origin = "R. Severo, 396 - Glória, Belo Horizonte - MG, 30870-030";
    const destination = "Av. Brg. Eduardo Gomes, 673 - Glória, Belo Horizonte - MG, 30870-100";
    const waypoints = [];  // Adicione waypoints se necessário
    const streetToAvoid = "R. Galba, 34 - Glória, Belo Horizonte - MG, 30870-040";
    const apiKey = 'AIzaSyC3AHLiIdnkAdhA_9Cly0AO1ewc1_D_11A';  // Substitua pela sua chave de API

    try {
        console.log("Obtendo coordenadas para a rua a evitar...");
        const { lat, lng } = await directions.getCoordinates(streetToAvoid, apiKey);
        console.log(`Coordenadas obtidas: lat=${lat}, lng=${lng}`);

        console.log("Obtendo rotas...");
        const routes = await directions.getRoutes(encodeURIComponent(origin), encodeURIComponent(destination), waypoints.map(wp => encodeURIComponent(wp)), apiKey);
        console.log(`Número de rotas obtidas: ${routes.length}`);

        const validRoutes = routes.filter(route => directions.isRouteValid(route, lat, lng));
        if (validRoutes.length > 0) {
            console.log("Rota válida encontrada");
            res.json(validRoutes[0]);
        } else {
            console.log("Nenhuma rota válida encontrada");
            res.status(404).send('Nenhuma rota válida encontrada');
        }
    } catch (error) {
        console.error("Erro ao obter rotas:", error.message);
        res.status(500).send(error.message);
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
