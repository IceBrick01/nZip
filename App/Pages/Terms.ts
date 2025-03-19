import { Element } from '@lightbery/scope'

/**
 * Terms of Service page
 * @returns Object containing the page title, description, and content
 */
// prettier-ignore
export default () => {
  return {
    title: 'nZip | Terms of Service',
    description: 'Terms of Service of nZip',
    content: new Element('body', { style: { display: 'flex', flexDirection: 'column', center: 'horizontal vertical', backgroundColor: '$background_color', margin: '0', width: '100dvw', height: '100dvh' } }, [
      new Element('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90dvw' } }, [
        new Element('h1', { class: 'text', style: { fontSize: '2rem' }, innerHTML: 'Terms of Service' }),
        new Element('h2', { class: 'text', style: { fontSize: '1.25rem' }, innerHTML: '1. Content Ownership' }),
        new Element('p', { class: 'text', innerHTML: 'We do not own any of the content available on nhentai.net. All content is owned by the original illustrators and creators. Users are responsible for ensuring that their use of this tool complies with applicable copyright laws.' }),
        new Element('h2', { class: 'text', style: { fontSize: '1.25rem' }, innerHTML: '2. Educational Use Only' }),
        new Element('p', { class: 'text', innerHTML: 'This project is intended for educational purposes only and should not be used for any other purposes.' }),
        new Element('h2', { class: 'text', style: { fontSize: '1.25rem' }, innerHTML: '3. No Affiliation' }),
        new Element('p', { class: 'text', innerHTML: 'This project is not affiliated with or endorsed by nhentai.net.' })
      ]),
      new Element('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90dvw', marginTop: '1rem' } }, [
        new Element('p', { class: 'text', innerHTML: 'By using nZip, you acknowledge that you have read and understood this Terms of Service and <a href="/privacy">Privacy Policy</a> document. If you do not agree with these terms, please refrain from using the service.' })
      ]),
      new Element('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90dvw', marginTop: '1rem' } }, [
        new Element('a', { class: 'text', href: 'javascript:history.back()', innerHTML: 'Back' })
      ])
    ])
  }
}
