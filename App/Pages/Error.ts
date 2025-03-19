import { Element } from '@lightbery/scope'

/**
 * Error page
 * @param args Arguments
 * @param args.error Error message to display on the page
 * @returns Object containing the page title, description, and content
 */
// prettier-ignore
export default (args: { error: string }) => {
  return {
    title: 'nZip | Error',
    description: 'Something went wrong.',
    content: new Element('body', { style: { display: 'flex', flexDirection: 'column', center: 'horizontal vertical', backgroundColor: '$background_color', margin: '0px', width: '100dvw', height: '100dvh' } }, [
      new Element('h1', { class: 'text', style: { fontSize: '4rem' }, innerHTML: 'Error' }),
      new Element('h1', { class: 'text', style: { fontSize: '1.25rem', maxWidth: '90dvw' }, innerHTML: `${args.error}` }),
      new Element('a', { class: 'text', style: { fontSize: '1.25rem', marginTop: '0.5rem' }, href: 'javascript:history.back()', innerHTML: 'Back' })
    ])
  }
}
