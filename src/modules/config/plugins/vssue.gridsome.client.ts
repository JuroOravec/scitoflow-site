import Vssue from 'vssue';
import GithubV3 from '@vssue/api-github-v3';
import 'vssue/dist/vssue.css';

import type { GridsomeClientPlugin } from '@/typings/gridsome';
import { metadata } from '../metadata';

export const vssueGridsomeClientPlugin: GridsomeClientPlugin = (Vue) => {
  const commentsConfig = metadata.comments;
  // See https://vssue.js.org/guide/gridsome.html#usage
  const vssueConfig = {
    api: GithubV3,
    owner: commentsConfig.vssueGithubUser,
    repo: commentsConfig.vssueGithubRepo,
    clientId: commentsConfig.vssueClientId,
    clientSecret: commentsConfig.vssueClientSecret,
    perPage: 20,
    autoCreateIssue: true,
  };

  Vue.use(Vssue, vssueConfig);
};
