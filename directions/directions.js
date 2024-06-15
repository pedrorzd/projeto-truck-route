const fetch = require('node-fetch');

async function getCoordinates(address, apiKey) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    console.log(`Requisitando coordenadas para: ${address}`);
    const response = await fetch(url);
    const data = await response.json();
    if (data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
    } else {
        throw new Error('Nenhuma coordenada encontrada para o endereço fornecido');
    }
}

async function getRoutes(origin, destination, waypoints, apiKey) {
    const waypointsParam = waypoints.length > 0 ? `&waypoints=${waypoints.join('|')}` : '';
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}${waypointsParam}&key=${apiKey}`;
    console.log(`Requisitando rotas de ${origin} para ${destination}`);
    const response = await fetch(url);
    const data = await response.json();
    if (data.routes.length > 0) {
        return data.routes;
    } else {
        throw new Error('Nenhuma rota encontrada para os endereços fornecidos');
    }
}

function isRouteValid(route, lat, lng, tolerance = 0.01) {
    for (const leg of route.legs) {
        for (const step of leg.steps) {
            const startLocation = step.start_location;
            const endLocation = step.end_location;
            if ((Math.abs(startLocation.lat - lat) < tolerance && Math.abs(startLocation.lng - lng) < tolerance) ||
                (Math.abs(endLocation.lat - lat) < tolerance && Math.abs(endLocation.lng - lng) < tolerance)) {
                return false;
            }
        }
    }
    return true;
}

module.exports = {
    getCoordinates,
    getRoutes,
    isRouteValid
};
