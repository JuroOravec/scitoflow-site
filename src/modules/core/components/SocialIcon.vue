<template>
  <div v-if="social" class="ContactIcon">
    <a
      v-bind="wrapper.attrs"
      v-on="wrapper.listeners"
      class="d-flex gap-2 align-center"
    >
      <v-icon>
        {{ social.icon }}
      </v-icon>
      {{ label ? social.name : '' }}
    </a>
  </div>
</template>

<static-query>
query getSocialIconMetadata {
  metadata {
    social {
      devto
      email
      facebook
      twitter
      github
      rss
      linkedin
      instagram
      youtube
      soundcloud
      twitch
    }
  }
}
</static-query>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  toRefs,
} from '@vue/composition-api';
import { VIcon } from 'vuetify/lib/components';

import type { GqlgetSocialIconMetadataQuery } from '@/__generated__/graphql';
import { useStaticQuery } from '../utils/useGridsomeQuery';
import { SOCIALS, SocialType } from '../utils/socials';

interface WrapperDefinition {
  attrs?: Record<string, any>;
  listeners?: Record<string, () => void>;
}

interface WrapperDefinitionContext {
  socialUsername?: string;
  socialUrl?: string;
}

const wrapperDefinitions: Record<
  'htmlLink' | 'jsLink',
  (context: WrapperDefinitionContext) => WrapperDefinition
> = {
  /** Plain regular anchor link */
  htmlLink: ({ socialUrl }) => ({
    attrs: {
      href: socialUrl,
      target: '_blank',
      rel: 'noopener',
    },
  }),
  /** Link that's triggered from JS, to obscure the URL from bots */
  jsLink: ({ socialUrl }) => ({
    listeners: {
      click: () => {
        if (socialUrl) {
          globalThis.open(socialUrl, '_blank', 'noopener');
        }
      },
    },
  }),
};

export interface SocialIconProps {
  type: SocialType;
  label?: boolean;
  jsLink?: boolean;
}

const SocialIcon = defineComponent({
  name: 'SocialIcon',
  components: {
    VIcon,
  },
  props: {
    type: { type: String as PropType<SocialType>, required: true },
    label: { type: Boolean, required: false },
    jsLink: { type: Boolean, required: false, default: false },
  },
  setup(props) {
    const { type, jsLink } = toRefs(props);

    const social = computed(() => SOCIALS[type.value] ?? {});

    const socialUsernames = useStaticQuery<
      GqlgetSocialIconMetadataQuery,
      NonNullable<GqlgetSocialIconMetadataQuery['metadata']>['social']
    >((data) => data?.metadata?.social);

    const socialUsername = computed((): string | undefined => {
      return socialUsernames.value?.[type.value] ?? undefined;
    });

    const socialUrl = computed((): string | undefined => {
      return socialUsername.value
        ? social.value?.getLink(socialUsername.value)
        : undefined;
    });

    const wrapper = computed((): WrapperDefinition => {
      const wrapperFactory = jsLink.value
        ? wrapperDefinitions.jsLink
        : wrapperDefinitions.htmlLink;
      return wrapperFactory({
        socialUsername: socialUsername.value,
        socialUrl: socialUrl.value,
      });
    });

    return {
      social,
      wrapper,
    };
  },
});
export default SocialIcon;
</script>
