import React, { useState } from "react";
import { Container, Button, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Fuente Baloo 2 de Google Fonts
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const VideosEntrenamiento = () => {
  const [videoUrl, setVideoUrl] = useState(
    "https://www.youtube.com/embed/TXSxN_WY208?list=PLfoM3A_rQ0tUBh7d8-24lTLin6v29s3N3"
  );
  const navigate = useNavigate();

  // Categorías con emojis
  const ejerciciosPorGrupo = {
    "🎯 Acrobacias Básicas": [
      "🤸 ACROBACIAS BÁSICAS - EL MACACO",
      "🎥 Curso Básico de Acrobacias",
      "✨ Acrobacias Fáciles - Stunts",
      "🙆‍♂️ Parada de manos con rodada",
      "🦵 Flexibilidad para SPLIT",
      "🖐️ Parada de manos paso a paso",
      "↗ KIP UP tutorial",
      "🌉 PINO PUENTE",
      "🧍‍♂️ Vertical de cabeza",
      "💃 3 Acrobacias para baile",
      "🕊️ Paloma a una mano",
      "🐌 Slow-roll - Gimnasia acrobática",
      "🔄 Rueda paso a paso",
      "🚫 Rueda sin manos"
    ],
    "🧘 Flexibilidad": [
      "🦵 Ejercicios para flexibilidad de piernas"
    ],
    "🤝 Acrobacias en Pareja": [
      "👯‍♀️ Acrobacia en pareja principiantes",
      "💫 Acrobacias sencillas en pareja",
      "🎶 Acrobacias TikTok en pareja",
      "😊 Acrobacia fácil en pareja",
      "🔝 Acrobacias intermedias en pareja",
      "⚡ Acrobacias avanzadas en pareja"
    ],
    "⚡ Avanzadas": [
      "💥 Mortal lateral - Side Flip",
      "🌀 Flic-Flac con rueda",
      "🏅 Rueda y flic-flac",
      "📏 Salto carpado",
      "⭐ Round-off principiantes"
    ],
    "📺 Playlist Porras": [
      "🎉 Ver Playlist Porras"
    ]
  };

  const videoMap = {
    "🤸 ACROBACIAS BÁSICAS - EL MACACO": "https://www.youtube.com/embed/NIjo70Dq9wo",
    "🎥 Curso Básico de Acrobacias": "https://www.youtube.com/embed/opC4bv1pbK8",
    "✨ Acrobacias Fáciles - Stunts": "https://www.youtube.com/embed/cFlkFakT7FY",
    "🙆‍♂️ Parada de manos con rodada": "https://www.youtube.com/embed/4HUJ-zKmkmM",
    "🦵 Flexibilidad para SPLIT": "https://www.youtube.com/embed/kP2oztmC93o",
    "🖐️ Parada de manos paso a paso": "https://www.youtube.com/embed/8djVh2Df6ew",
    "↗ KIP UP tutorial": "https://www.youtube.com/embed/gbsYQq_ANMY",
    "🌉 PINO PUENTE": "https://www.youtube.com/embed/VnWzN5WxbFM",
    "🧍‍♂️ Vertical de cabeza": "https://www.youtube.com/embed/LaxBQQJTf4w",
    "💃 3 Acrobacias para baile": "https://www.youtube.com/embed/4JSmTbeIGzg",
    "🕊️ Paloma a una mano": "https://www.youtube.com/embed/LtaEUc-9pek",
    "🐌 Slow-roll - Gimnasia acrobática": "https://www.youtube.com/embed/WmPaDnjUJJM",
    "🔄 Rueda paso a paso": "https://www.youtube.com/embed/jKMOOqU6Ai0",
    "🚫 Rueda sin manos": "https://www.youtube.com/embed/rwydmiABAoA",
    "💥 Mortal lateral - Side Flip": "https://www.youtube.com/embed/9aFTTS-cJQA",
    "🌀 Flic-Flac con rueda": "https://www.youtube.com/embed/xoywXLojb-o",
    "🦵 Ejercicios para flexibilidad de piernas": "https://www.youtube.com/embed/ubp4VtL8PzQ",
    "🏅 Rueda y flic-flac": "https://www.youtube.com/embed/Gv3tdKpANdY",
    "👯‍♀️ Acrobacia en pareja principiantes": "https://www.youtube.com/embed/1FUSmHJMN44",
    "💫 Acrobacias sencillas en pareja": "https://www.youtube.com/embed/J2ZDz_7cwcA",
    "🎶 Acrobacias TikTok en pareja": "https://www.youtube.com/embed/5vi1_iutCRE",
    "😊 Acrobacia fácil en pareja": "https://www.youtube.com/embed/s-Od8cuBvuQ",
    "🔝 Acrobacias intermedias en pareja": "https://www.youtube.com/embed/ahW8kMjt-dU",
    "⚡ Acrobacias avanzadas en pareja": "https://www.youtube.com/embed/TEv6g3LWUfM",
    "📏 Salto carpado": "https://www.youtube.com/embed/w6U4QiUBd84",
    "⭐ Round-off principiantes": "https://www.youtube.com/embed/m5gZWEP4XSA",
    "🎉 Ver Playlist Porras": "https://www.youtube.com/embed/videoseries?list=PLJ5zQoDXumRB9ab9LZIax1qCSOv5nUtqN"
  };

  const loadVideo = (ejercicio) => {
    const url = videoMap[ejercicio] || videoUrl;
    setVideoUrl(url);
  };

  return (
    <Container className="mt-4 mb-5" style={{ fontFamily: "'Baloo 2', cursive" }}>
      <motion.h2
        className="text-center mb-4"
        style={{ color: "#ff4081", fontWeight: "bold", fontSize: "2.5rem" }}
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        🎬 Videos de Entrenamiento Acrobático
      </motion.h2>

      <div className="text-start mb-4">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <Button
            onClick={() => navigate("/dashboard")}
            style={{
              background: "linear-gradient(45deg, #ff4081, #ff80ab)",
              border: "none",
              borderRadius: "25px",
              padding: "10px 25px",
              fontWeight: "bold",
              fontSize: "1.1rem",
              color: "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
          >
            ⬅ Volver al Inicio
          </Button>
        </motion.div>
      </div>

      <motion.div
        className="mb-5"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        <Card style={{
          border: "none",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "15px",
          overflow: "hidden"
        }}>
          <Card.Body className="p-0">
            <iframe
              width="100%"
              height="450"
              src={videoUrl}
              title="Video de entrenamiento"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: "15px 15px 0 0" }}
            ></iframe>
          </Card.Body>
        </Card>
      </motion.div>

      {Object.keys(ejerciciosPorGrupo).map((grupo, gIndex) => (
        <motion.div
          key={grupo}
          className="mb-5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 * gIndex, duration: 0.6 }}
        >
          <h3
            style={{
              color: "#ff4081",
              fontWeight: "bold",
              borderBottom: "2px solid #ff80ab",
              paddingBottom: "8px",
              fontSize: "1.6rem"
            }}
          >
            {grupo}
          </h3>
          <Row>
            {ejerciciosPorGrupo[grupo].map((ejercicio, index) => (
              <Col key={ejercicio} xs={6} md={4} lg={3} className="mb-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * index, duration: 0.4 }}
                >
                  <Button
                    onClick={() => loadVideo(ejercicio)}
                    style={{
                      width: "100%",
                      background: "linear-gradient(45deg, #ff4081, #ff80ab)",
                      border: "none",
                      borderRadius: "15px",
                      padding: "12px",
                      fontWeight: "500",
                      fontSize: "1rem",
                      boxShadow: "0 4px 10px rgba(255, 64, 129, 0.4)",
                      color: "#fff",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.07)";
                      e.target.style.boxShadow = "0 6px 14px rgba(255, 64, 129, 0.6)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)";
                      e.target.style.boxShadow = "0 4px 10px rgba(255, 64, 129, 0.4)";
                    }}
                  >
                    {ejercicio}
                  </Button>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      ))}
    </Container>
  );
};

export default VideosEntrenamiento;
