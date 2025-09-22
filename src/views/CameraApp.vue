
<template>
  <ion-page>
    <ion-content :fullscreen="true" class="camera-bg">
      <!-- Top controls bar -->
      <div class="camera-top-bar">
        <ion-button fill="clear" size="small"><ion-icon :icon="flash" /></ion-button>
        <span class="camera-mode">Auto</span>
        <ion-button fill="clear" size="small"><ion-icon :icon="settingsOutline" /></ion-button>
      </div>

      <!-- Camera preview area -->
      <div class="camera-preview-container">
        <video v-if="streaming" ref="videoEl" autoplay playsinline class="camera-preview" />
        <img v-else-if="lastPhoto" :src="lastPhoto" class="camera-preview" />
        <div v-else class="camera-placeholder"></div>
      </div>

      <!-- Camera mode bar -->
      <div class="camera-mode-bar">
        <span :class="{active: mode==='portrait'}">PORTRAIT</span>
        <span :class="{active: mode==='standard'}">STANDARD</span>
        <span :class="{active: mode==='video'}">VIDEO</span>
        <span :class="{active: mode==='pro'}">PRO</span>
      </div>

      <!-- Bottom controls (shutter and preview) -->
      <div class="camera-bottom-bar">
        <img v-if="lastPhoto" :src="lastPhoto" class="camera-thumbnail" />
        <ion-button @click="capture" class="camera-shutter">
          <div class="shutter-circle"></div>
        </ion-button>
        <ion-button fill="clear" size="small"><ion-icon :icon="videocam" /></ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue';
import { flash, settingsOutline, videocam } from 'ionicons/icons';

const mode = ref('standard');
// streaming and videoEl refs for live camera stream if using WebRTC

const lastPhoto = ref(null);
const capture = async () => {
  // your camera capture logic...
};
</script>

<style scoped>
.camera-bg {
  background: #111;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.camera-top-bar {
  position: absolute;
  top: 18px;
  left: 0; right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 18px;
  z-index: 2;
  color: #fff;
}

.camera-preview-container {
  width: 100%;
  margin: 0 auto;
  margin-top: 60px;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.camera-preview {
  border-radius: 22px;
  width: 92vw;
  height: 58vh;
  background: #222;
  object-fit: cover;
}
.camera-mode-bar {
  display: flex;
  width: 100%;
  justify-content: center;
  gap: 26px;
  font-size: 15px;
  color: #bbb;
  margin: 10px 0 0 0;
}
.camera-mode-bar .active {
  color: #4cd964;
  font-weight: 700;
}
.camera-bottom-bar {
  position: absolute;
  bottom: 22px; left: 0; right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
}
.camera-thumbnail {
  width: 42px; height: 42px;
  border-radius: 50%;
  border: 2px solid #fff;
  object-fit: cover;
}
.camera-shutter {
  background: none;
  border: none;
  outline: none;
}
.shutter-circle {
  width: 78px; height: 78px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 14px #222;
  border: 4px solid #ddd;
}
</style>
