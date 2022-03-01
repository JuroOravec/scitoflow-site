export interface NavItem {
  text: string;
  to: string;
}

export enum CoreRoutes {
  HOME = '/',
  ABOUT = '/about',
  NOT_FOUND = '/404',
}
