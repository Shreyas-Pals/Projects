import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import {
    getAuth,
    onIdTokenChanged,
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCERDtC-uZIW56b6h2zrMpaVQbMkhgdhPE",

    authDomain: "canvus-db331.firebaseapp.com",

    projectId: "canvus-db331",

    storageBucket: "canvus-db331.firebasestorage.app",

    messagingSenderId: "187869281206",

    appId: "1:187869281206:web:463b59754f9d4fa1cddf17",

    measurementId: "G-MRPS5Q8MP4",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const newcanvasBtn = document.getElementById("newCanvasBtn");
const token = localStorage.getItem("jwt_token");

onIdTokenChanged(auth, async (user) => {
    if (!user) {
        localStorage.removeItem("jwt_token");
        return;
    }
    console.log("Token refresh");
    const newIdToken = await user.getIdToken();

    const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: newIdToken }),
    });

    const data = await res.json();
    localStorage.setItem("jwt_token", data.token);
});

const canvasList = document.getElementById("canvasList");
async function fetchCanvases() {
    try {
        canvasList.innerHTML = "";
        const response = await fetch("/api/canvases", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const canvases = await response.json();

        canvases.forEach((c) => {
            const card = document.createElement("div");
            card.className = "canvas-card";
            card.textContent = c.name;
            canvasList.appendChild(card);
        });
    } catch (err) {
        console.error("Error fetching canvases:", err);
    }
}

fetchCanvases();

newcanvasBtn.addEventListener("click", async () => {
    try {
        const response = await fetch("/api/canvases", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: `Canvas ${Date.now()}` }),
        });

        const data = await response.json();
        console.log("Canvas created:", data);

        const card = document.createElement("div");
        card.className = "canvas-card";
        card.textContent = data.name;
        document.getElementById("canvasList").appendChild(card);
    } catch (err) {
        console.log("Error creating a new canvas", err);
    }
});
