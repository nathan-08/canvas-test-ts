import { ITextPage } from '../types';

export function formatText( str: string ): ITextPage[] {
    const MAX_LENGTH = 17;
    const words = str.split( ' ' );
    const rows: string[] = [];
    let temp = '';
    for( let i = 0; i < words.length; i++ ) {
        const remainingSpace = MAX_LENGTH - temp.length;
        if ( words[i][0] === '\n' || words[i].length > remainingSpace ) {
            rows.push( temp.slice() );
            if ( words[i][0] === '\n' )
                temp = words[i].slice( 1 ) + ' ';
            else
                temp = words[i] + ' ';
        }
        else {
            temp += words[i] + ' ';
        }
    }
    if ( temp.length ) {
        rows.push( temp );
    }
    const pages = [];
    for ( let i = 0; i < rows.length; i += 2 ) {
        const page = {
            line1: '',
            line2: '',
        };
        page.line1 = rows[i];
        if ( i+1 < rows.length ) {
            page.line2 = rows[i+1];
        }
        pages.push( page );
    }
    return pages;
}