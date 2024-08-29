<template>
  <Layout #home-hero-before>
    <ParticlesBackground />
  </Layout>
</template>

<script setup>
import DefaultTheme from 'vitepress/theme';
import ParticlesBackground from './ParticlesBackground.vue';

const { Layout } = DefaultTheme;
</script>