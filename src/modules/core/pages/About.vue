<template>
  <AppLayout :meta-props="metaProps" class="About">
    <div class="text-center secondary--text text--darken-1 pt-16">
      <h1>{{ metaProps.pageTitle }}</h1>
    </div>

    <g-image
      src="@/modules/core/assets/imgs/profile-pic-front-bw.png"
      quality="100"
      :style="{ borderBottom: '1px solid black' }"
      class="mb-4"
    />
    <div class="About__content">
      <p>
        Juro
        <SpeechIcon text="Euro" :style="{ marginTop: '-2px' }" />
      </p>
      <p>
        Software engineer, science enthusiast, and the author of the quote "Anyone
        can look elegant and mysterious with a bit of black & white photography".
      </p>
      <p>Born as a baby 👶 in the small village of...</p>
      <p>Just kidding, let's stick to the basics. </p>

      <br />

      <h2>Work</h2>
      <p>
        In short, if it's running on the Internet or is accessed using a browser,
        I probably worked with that technology.
      </p>

      <p>
        I worked on projects with high degree of ambiguity; in both academia and industry;
        and in domains like:
        <ul>
          <li>
            <strong>Pharma / Drug discovery</strong> - Exploratory, management, and workflow Drug discovery tools at
            <a href="https://benevolent.ai/" rel="nofollow noopener noreferrer">
              BenevolentAI</a>.
          </li>
          <li>
            <strong>Biotech / Bioinformatics</strong> -
            Academic exploratory Bioinformatics open-source tool
            <a href="https://caffeine.dd-decaf.eu/" rel="nofollow noopener noreferrer">
              Caffeine
            </a>
            (DD-DeCaF project) at
            <a href="https://www.biosustain.dtu.dk/" rel="nofollow noopener noreferrer">
              The Novo Nordisk Foundation Center for Biosustainability (DTU Biosustain)</a>.
          </li>
          <li>
            <strong>Marketing automation / Digital experience platform</strong> -
            Integrated multi-national e-commerce websites with analytics and marketing automation at
            <a href="https://exponea.com/" rel="nofollow noopener noreferrer">
              Exponea
            </a>
            (now Bloomreach).
          </li>
        </ul>
        See my LinkedIn for further details. And head over to <g-link :to="PostProjectRoutes.PROJECTS">projects</g-link>
        to see some of my projects.
      </p>

      <p>
        My focus:
        <ul>
          <li>
            <strong>Technical domains / Deep-tech</strong>
          </li>
          <li>
            <strong>B2B solutions / Internal tools</strong>
             - Including prototyping, process definition and process streamlining
          </li>
          <li>
            <strong>Data-driven</strong>
            - Including data visualization and exploration
          </li>
        </ul>
      </p>

      <p>
        So if what you need is a <strong>purpose-driven full-stack software engineer</strong>,
        use the business links below for enquiries.
      </p>
      <br />

      <!-- <h2>Personal</h2>

      <p>
        If you're wondering why I focus on deep-tech, well, I did study Biotech at
        University of Edinburgh, UK.
      </p>
      <p>
        When you listen for years about the marvels of what is, could be, and could be lost...
        it's hard to go back.
      </p>

      <p>
        Wet-lab was never my thing, though. Instead, I interviewed and
        prototyped with researchers and R&D companies,
        and ended up working on a HORIZON 2020 project at DTU Biosustain in Copenhagen, DK.
      </p>
      <p>
        This was a crazy ride, but more on this maybe some other time.
      </p> -->

      <h2>Contact</h2>

      <div class="d-flex flex-wrap gap-x-4 gap-y-8">
        <div v-for="{ groupName, socials } in contactGroups" :key="groupName" :style="{ flex: '1 0 200px' }">
          <h4>{{ groupName }}</h4>
          <div class="d-flex flex-column gap-1">
            <SocialIcon v-for="socialProps in socials" v-bind="socialProps" :key="socialProps.type" />
          </div>
        </div>
      </div>

    </div>
  </AppLayout>
</template>

<static-query>
query getAboutPageMetadata {
  metadata {
    siteAuthor {
      firstName
      lastName
      fullName
      gender
    }
  }
}
</static-query>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { VBtn, VIcon } from 'vuetify/lib/components';

import type { GqlgetAboutPageMetadataQuery } from '@/__generated__/graphql';
import AppLayout from '@/modules/core/components/AppLayout.vue';
import type { MetaProps } from '@/modules/core/components/Meta.vue';
import SpeechIcon from '@/modules/core/components/SpeechIcon.vue';
import SocialIcon, { SocialIconProps } from '@/modules/core/components/SocialIcon.vue';
import { OgType } from '@/modules/core/utils/metaInfo';
import { refToRefs } from '@/modules/core/utils/vueReactivity';
import { useStaticQuery } from '@/modules/core/utils/useGridsomeQuery';
import type { OgProfileGender } from '@/modules/core/utils/metaTagsOpenGraph';
import { SocialType } from '@/modules/core/utils/socials';
import { PostProjectRoutes } from '@/modules/postProject/postProjectTypes';

const contactGroups: { groupName: string; socials: SocialIconProps[] }[] = [
  {
    groupName: 'Business',
    socials: [
      { type: SocialType.EMAIL, jsLink: true, label: true },
      { type: SocialType.LINKEDIN, label: true },
    ]
  },
  {
    groupName: 'Where I share my work',
    socials: [
      { type: SocialType.YOUTUBE, label: true },
      { type: SocialType.TWITCH, label: true },
      { type: SocialType.DEVTO, label: true },
      { type: SocialType.GITHUB, label: true },
    ]
  },
  {
    groupName: 'Socials',
    socials: [
      { type: SocialType.INSTAGRAM, label: true },
      { type: SocialType.FACEBOOK, label: true },
      { type: SocialType.TWITTER, label: true },
    ]
  },
  {
    groupName: 'Other',
    socials: [
      { type: SocialType.RSS, label: true },
    ]
  },
];


const About = defineComponent({
  name: 'About',
  components: {
    AppLayout,
    SocialIcon,
    SpeechIcon,
    VBtn,
    VIcon,
  },
  setup() {
    const siteAuthor = useStaticQuery<
      GqlgetAboutPageMetadataQuery,
      NonNullable<
        NonNullable<GqlgetAboutPageMetadataQuery['metadata']>['siteAuthor']
      >
    >((data) => data?.metadata?.siteAuthor ?? {});
    const { firstName, lastName, fullName, gender } = refToRefs(siteAuthor);

    const metaProps: MetaProps = {
      pageTitle: 'About me',
      pageDescription: `This is ${fullName?.value ?? 'me'}`,
      pageTags: ['about', 'blog', 'software', fullName?.value ?? ''],
      ogType: OgType.PROFILE,
      ogProfile: {
        firstName: firstName?.value ?? null,
        lastName: lastName?.value ?? null,
        gender: (gender?.value as OgProfileGender) ?? null,
      },
      // TODO
      // images?: Maybe<CreateOgImageTagsArgs[]>;
      // videos?: Maybe<CreateOgVideoTagsArgs[]>;
    };

    return {
      metaProps,
      contactGroups,
      PostProjectRoutes,
    };
  },
});
export default About;
</script>

<style lang="scss">
.About {
  &__content {
    max-width: 600px;
    margin: auto;
  }
}
</style>
