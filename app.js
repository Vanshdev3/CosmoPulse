const NASA_KEY = 'tfnQBqmzWQdJrNdCncknkMdkThKcmCgCBN9md7dq';

// High-quality local fallback data if NASA's servers are offline
const MOCK_APOD = {
    title: 'The Pillars of Creation (CosmoPulse Cache)',
    url: 'https://images-assets.nasa.gov/image/PIA01492/PIA01492~orig.jpg',
    explanation: 'This composite image reveals a detailed view of the iconic Pillars of Creation in the Eagle Nebula. Captured across infrared waves, it shows young stars forming inside dense clouds of interstellar gas and cosmic dust.'
};

const MOCK_FLARES = [
    { flrID: 'FLR-2026-X89', classType: 'X8.9 (Severe)', peakTime: '2026-10-31T14:22Z' },
    { flrID: 'FLR-2026-M42', classType: 'M4.2 (Moderate)', peakTime: '2026-10-30T09:15Z' },
    { flrID: 'FLR-2026-C12', classType: 'C1.2 (Minor)', peakTime: '2026-10-30T01:45Z' }
];

async function initDashboard() {
    // 1. Load Astronomy Picture
    try {
        const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`);
        if (!res.ok) throw new Error('NASA APOD down');
        const data = await res.json();
        renderAPOD(data);
    } catch (err) {
        console.warn('Using APOD fallback data due to NASA 500 error:', err);
        renderAPOD(MOCK_APOD);
    }

    // 2. Load Solar Flares
    try {
        const endDate = new Date().toISOString().slice(0, 10);
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        const res = await fetch(`https://api.nasa.gov/DONKI/FLR?startDate=${startDate}&endDate=${endDate}&api_key=${NASA_KEY}`);
        if (!res.ok) throw new Error('NASA DONKI down');
        const data = await res.json();
        renderFlares(data);
    } catch (err) {
        console.warn('Using Flare fallback data due to NASA 500 error:', err);
        renderFlares(MOCK_FLARES);
    }
}

function renderAPOD(data) {
    const apodBox = document.getElementById('apod-box');
    if (!apodBox) return;

    apodBox.innerHTML = `
        <h3>${data.title}</h3>
        <img src="${data.url}" alt="${data.title}">
        <p style="color: #8b949e; line-height: 1.5; font-size: 0.95rem; margin-top: 12px;">${data.explanation}</p>
    `;
}

function renderFlares(data) {
    const container = document.getElementById('flare-box');
    if (!container) return;

    container.innerHTML = '';

    if (!data || data.length === 0) {
        container.innerHTML = '<li>Sun is exceptionally quiet. No major solar flares detected.</li>';
        return;
    }

    data.slice(-4).reverse().forEach(flare => {
        const item = document.createElement('li');
        item.innerHTML = `<strong>ID:</strong> ${flare.flrID} | <strong>Class:</strong> <span style="color: #f0883e;">${flare.classType}</span> <br> <span style="color:#8b949e; font-size:0.8rem;">Peak Time: ${flare.peakTime}</span>`;
        container.appendChild(item);
    });
}

document.addEventListener('DOMContentLoaded', initDashboard);
