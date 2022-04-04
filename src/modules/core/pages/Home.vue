<template>
  <AppLayout
    :meta-props="metaProps"
    class="Home"
    :class="{ large: $vuetify.breakpoint.smAndUp }"
  >
    <div class="mt-n3 d-flex justify-center">
      <div class="Home__heroImg" />
      <div class="Hero text-center pt-14 pb-2 px-4 mx-4">
        <h1 class="Hero__title">Scitoflow</h1>
        <v-carousel cycle hide-delimiters height="auto" :show-arrows="false">
          <v-carousel-item v-for="(tagline, i) in taglines" :key="i">
            <h2 class="Hero__subtitle">{{ tagline }}</h2>
          </v-carousel-item>
        </v-carousel>
      </div>
    </div>

    <div
      class="pt-16 text-body-1 secondary--text text--lighten-3"
      style="margin-top: 600px"
    >
      <p class="text-h5 pb-8">
        Scitoflow is where we explore the behind-the-scenes processes of doing
        science. The boring, the tedious, the things you don't hear in the news,
        the… Oh, you want fun? Curiosity is the fun here!
      </p>

      <div class="text-center pb-8">
        <h3 class="Hero__subtitle secondary--text text--lighten-3 mx-auto">
          Coming soon...
        </h3>
        <div class="text-body-1 secondary--text text--lighten-3">
          <p class="mb-0">The podcast is currently in development.</p>
          <p>Sign up to be the first to hear about its release.</p>
        </div>

        <div class="text-center">
          <iframe
            src="https://scitoflow.substack.com/embed"
            width="480"
            height="90"
            frameborder="0"
            scrolling="no"
          />
        </div>
      </div>

      <h3>The show</h3>

      <p>
        This show is all about the processes and operations behind science. How
        they differ across groups, the motivations behind them, or how to
        improve them. We're looking for the power-ups that get the scientists
        into the FLOW!
      </p>

      <br />
      <h3>The topics</h3>
      <p>Here's a taste of the topics we may explore:</p>
      <p>
        How do you come up with hypotheses to test? Is it done systematically,
        or ad hoc? How do you capture and share the learnings from (in)validated
        questions? Is the knowledge centralised by single person, or group, or
        is it effectively disseminated?
      </p>
      <p>
        How do you apply for grants? Do you put everything on a single large
        project, or several smaller? Do you write proposals ad hoc,
        continuously, or do you have a dedicated period every month / quarter /
        year? And do you keep it in spreadsheets, or do you assume you've been
        rejected unless you hear back?
      </p>
      <p>
        How do you review manuscripts or student submissions? Do you do a single
        pass, or two, or three? At what time of the day do you read them? How do
        you retain the information?
      </p>
      <p>
        How many undergrad-hours does it take to fulfil a request in labs that
        make use of students to provide services? Is it more efficient to let
        undergrads do it, or to outsource it to a different lab? Is there a
        quality control in place?
      </p>

      <br />
      <h3>The host</h3>

      <div
        class="d-flex gap-5"
        :class="
          $vuetify.breakpoint.xsOnly
            ? 'flex-column align-center'
            : 'align-start flex-row-reverse'
        "
      >
        <g-image
          src="../assets/imgs/profile-pic-front-white-bg-cc-sq-md.png"
          width="250"
        />
        <div>
          <p>
            I'm Juro Oravec. I'm a biotechnologist turned software developer.
            I've been at many facets of research, working at a drug discovery
            startup, a EU's Horizon 2020 bioinformatics research project, or
            collaborated with a Scottish contract research organization. I've
            been at DTU Biosustain (that's Danish Tech Uni) and studied at the
            Uni of Edinburgh (UK). And for some time I was working on a
            software-for-life-science startup.
          </p>
          <p>
            I'm fascinated by the role that innovation and tech plays for
            humanity. We often pose academia and industry as the polar
            opposites, but I think they're closer than it seems.
          </p>
          <p>
            <a href="https://jurora.vc/about">Find more about me here</a>
          </p>
        </div>
      </div>
    </div>

    <!-- TODO: Add latest episodes  -->
    <!-- <h2 class="pt-16 mt-16 secondary--text text--lighten-3">Latest posts</h2>
    <PostCollection :posts="latestPosts" :small="$vuetify.breakpoint.xsOnly" /> -->
  </AppLayout>
</template>

<page-query>
query getHomeData {
	blogs: allBlogPost(limit: 5) {
    edges {
      node {
        postId
        path
        title
        description
        datePublished
        images {
          path
          alt
        }
      }
    }
  }
	projects: allProjectPost(limit: 5) {
    edges {
      node {
        postId
        path
        title
        description
        datePublished
        images {
          path
          alt
        }
      }
    }
  }
  metadata {
    siteDescription
  }
}
</page-query>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';
import sortBy from 'lodash/sortBy';
import shuffle from 'lodash/shuffle';
import { VCarousel, VCarouselItem } from 'vuetify/lib/components';

import AppLayout from '@/modules/core/components/AppLayout.vue';
import type { GqlgetHomeDataQuery } from '@/__generated__/graphql';
import type { MetaProps } from '@/modules/core/components/Meta.vue';
import { usePageQuery } from '@/modules/core/utils/useGridsomeQuery';
import PostCollection from '@/modules/post/components/PostCollection.vue';
import { refToRefs } from '../utils/vueReactivity';
import { isNotNil } from '../utils/isNotNull';

const taglines = shuffle([
  'Podcast about the processes that make science happen',
  'Podcast about the science of doing science',
  'Podcast about the art of doing science',
  'Podcast about the behind-the-scenes of science',
  'Podcast about the boring side of science',
  'Podcast about the process mining in science',
]);

const Home = defineComponent({
  name: 'Home',
  components: {
    AppLayout,
    PostCollection,
    VCarousel,
    VCarouselItem,
  },
  setup() {
    const data = usePageQuery<GqlgetHomeDataQuery, GqlgetHomeDataQuery>(
      (data) => data ?? {},
    );
    const { metadata, projects, blogs } = refToRefs(data);

    const latestPosts = computed(() => {
      const posts = [
        ...(projects?.value?.edges ?? []),
        ...(blogs?.value?.edges ?? []),
      ]
        .map((post) => post?.node ?? null)
        .filter(isNotNil)
        .slice(0, 3);

      return sortBy(posts, (post) => post.datePublished);
    });

    const siteDescription = computed(
      (): string => metadata?.value?.siteDescription ?? '',
    );

    const metaProps = computed(
      (): MetaProps => ({
        pageTitle: '',
        pageDescription: siteDescription.value,
      }),
    );

    return {
      latestPosts,
      metaProps,
      taglines,
    };
  },
});
export default Home;
</script>

<style lang="scss">
/* See https://blog.logrocket.com/creating-infinite-css-background-image-loop/ */
@keyframes slide {
  0% {
    transform: translate(0);
  }
  100% {
    transform: translate(-200px); /* The image width */
  }
}

.Home {
  &__heroImg {
    position: absolute;
    max-width: unset;
    min-height: 600px;
    width: 400%;
    background-image: url('~@/modules/core/assets/imgs/scitoflow-logo-pattern2.png');
    background-size: 200px;
    background-repeat: repeat;
    animation: slide 12s linear infinite;
  }

  .Hero {
    position: absolute;
    margin-top: 190px;
    background: #77bb3fff;
    border: 5px solid #c1dda3;

    &__title {
      letter-spacing: 5px !important;
      font-family: 'Avenir', 'Helvetica', 'Helvetica Neue', 'Arial', sans-serif !important;
      font-weight: 500 !important;
      font-size: 4rem !important;
      color: white;
    }

    &__subtitle {
      font-family: 'Avenir', 'Helvetica', 'Helvetica Neue', 'Arial', sans-serif !important;
      font-weight: 500 !important;
      color: white;
    }
  }

  @media (max-width: 360px) {
    .Hero {
      padding-top: 165px;
    }
  }

  &.large {
    .Hero {
      &__subtitle {
        width: 550px;
      }
    }
  }
}
</style>
