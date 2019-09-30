import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'vsf-layout',
    templateUrl: './layout.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {}
