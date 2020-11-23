export function formatText( str: string ): string[] {
    const MAX_LENGTH = 17;
    const words = str.split( ' ' );
    const rows: string[] = [];
    let temp = '';
    for( let i = 0; i < words.length; i++ ) {
        const remainingSpace = MAX_LENGTH - temp.length;
        if ( words[i].length < remainingSpace ) {
            temp += words[i] + ' ';
        }
        else {
            rows.push( temp.slice() );
            temp = words[i] + ' ';
        }
    }
    if ( temp.length ) {
        rows.push( temp );
    }
    return rows;
}