import { Action } from '@ngrx/store';

export const EMPTY = '[App] EMPTY';

export class Empty implements Action {
  readonly type = EMPTY;
}
