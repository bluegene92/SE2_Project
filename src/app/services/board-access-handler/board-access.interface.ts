import { resetComponentState } from "@angular/core/src/render3/instructions";

export interface BoardAccessInterface {
  disable(): void
  enable(): void
  reset(): void
}
