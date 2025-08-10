import {Pipe} from '@angular/core';
import {formatDistanceToNow} from 'date-fns';

@Pipe({
    name: 'timeAgo',
    standalone: true,
})
export class TimeAgoPipe {

    transform(value: Date | string | number, addSuffix: boolean = true): string {

        if(!value) {
            return '';
        }

        try {

            return formatDistanceToNow(new Date(value), {
                addSuffix,
                includeSeconds: false
            });

        } catch {

            return '';

        }

    }

}
