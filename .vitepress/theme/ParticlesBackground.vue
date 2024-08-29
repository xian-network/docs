<template>
    <div id="particles-js"></div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  
  const tsParticlesModule = import("https://cdn.jsdelivr.net/npm/@tsparticles/engine@3.1.0/+esm");
  const loadAllModule = import("https://cdn.jsdelivr.net/npm/@tsparticles/all@3.1.0/+esm");

  async function loadParticles(options) {
    const { tsParticles } = await tsParticlesModule;
    const { loadAll } = await loadAllModule;
    await loadAll(tsParticles);
    await tsParticles.load({ id: "particles-js", options });
}

const configs = {
  "particles": {
    "number": {
      "value": 4,
      "density": {
        "enable": true,
        "value_area": 300
      }
    },
    "color": {
      "value": "#1b1e34"
    },
    "shape": {
      "type": "polygon",
      "polygon": {
        "nb_sides": 6
      },
    },
    "opacity": {
      "value": 0.115,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 0.5,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 900,
      "random": false,
      "anim": {
        "enable": true,
        "speed": 3,
        "size_min": 20,
        "sync": false
      }
    },
    "move": {
      "enable": true,
      "speed": 1.5,
      "direction": "top-left",
      "random": true,
      "straight": true,
      "out_mode": "bounce",
      "bounce": true,
      "attract": {
        "enable": true,
        "rotateX": 700,
        "rotateY": 10000
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": false,
        "mode": "grab"
      },
      "onclick": {
        "enable": false,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 3
      },
    }
  }
}

  onMounted(async () => {
    loadParticles(configs);

  });
  </script>
  
  <style scoped>
  #particles-js {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0 !important;
  }
  </style>