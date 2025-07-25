import { CanDeactivateFn } from '@angular/router';
import { MemberEditComponent } from '../components/members/member-edit/member-edit.component';

export const preventUnsavedChangesGuard: CanDeactivateFn<
  MemberEditComponent
> = (component) => {
  if (component.editForm.dirty) {
    return confirm('Any unsaved changes will be lost.');
  }

  return true;
};
