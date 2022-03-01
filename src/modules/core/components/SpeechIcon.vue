<template>
  <v-btn icon small color="primary" class="SpeechIcon" @click="onSpeak">
    <v-icon small color="#0000005f"> mdi-volume-high </v-icon>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent, onMounted, toRefs } from '@vue/composition-api';
import { VBtn, VIcon } from 'vuetify/lib/components';

import AppLayout from '@/modules/core/components/AppLayout.vue';
import SocialIcon from '@/modules/core/components/SocialIcon.vue';
import { createSpeechSynth } from '../utils/speechSynth';

const SpeechIcon = defineComponent({
  name: 'SpeechIcon',
  components: {
    AppLayout,
    SocialIcon,
    VBtn,
    VIcon,
  },
  props: {
    text: { type: String, required: true, default: null },
  },
  setup(props) {
    const { text } = toRefs(props);

    const { speak, loadVoice } = createSpeechSynth();

    onMounted(() => loadVoice());

    const onSpeak = (): void => {
      if (!text.value) return;
      speak(text.value);
    };

    return {
      onSpeak,
    };
  },
});
export default SpeechIcon;
</script>
