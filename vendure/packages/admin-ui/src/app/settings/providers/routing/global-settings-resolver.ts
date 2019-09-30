import { Injectable } from '@angular/core';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { GetGlobalSettings } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

/**
 * Resolves the global settings.
 */
@Injectable()
export class GlobalSettingsResolver extends BaseEntityResolver<GetGlobalSettings.GlobalSettings> {
    constructor(private dataService: DataService) {
        super(
            // we will never be creating a new GlobalSettings entity, so this part is not used.
            {} as any,
            () => this.dataService.settings.getGlobalSettings().mapStream(data => data.globalSettings),
        );
    }
}
