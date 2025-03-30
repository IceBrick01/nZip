import { Element } from '@lightbery/scope'

/**
 * Privacy Policy page
 * @returns Object containing the page title, description, and content
 */
// prettier-ignore
export default () => {
  return {
    title: 'nZip | Privacy Policy',
    description: 'Privacy Policy of nZip',
    content: new Element('body', { style: { display: 'flex', flexDirection: 'column', center: 'horizontal vertical', backgroundColor: '$background_color', margin: '0', width: '100dvw', height: '100dvh' } }, [
      new Element('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90dvw' } }, [
        new Element('h1', { class: 'text', style: { fontSize: '2rem' }, innerHTML: 'Privacy Policy' }),
        new Element('h2', { class: 'text', style: { fontSize: '1.25rem' }, innerHTML: '1. Data We Collect' }),
        new Element('p', { class: 'text', innerHTML: 'Geolocation information, Browser type and version, Referrer URL, Device information.' }),
        new Element('h2', { class: 'text', style: { fontSize: '1.25rem' }, innerHTML: '2. Data We Do Not Collect' }),
        new Element('p', { class: 'text', innerHTML: 'We do not collect any information that can directly identify users, such as IP addresses.' }),
        new Element('h2', { class: 'text', style: { fontSize: '1.25rem' }, innerHTML: '3. Purpose of Data Collection' }),
        new Element('p', { class: 'text', innerHTML: 'The data we collect is used solely for improving the service and ensuring its proper functionality.' }),
        new Element('h2', { class: 'text', style: { fontSize: '1.25rem' }, innerHTML: '4. Data Sharing' }),
        new Element('p', { class: 'text', innerHTML: 'We do not share or sell any collected data to third parties.' })
      ]),
      new Element('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90dvw', marginTop: '1rem' } }, [
        new Element('p', { class: 'text', innerHTML: 'By using nZip, you acknowledge that you have read and understood <a href="/terms">Terms of Service</a> and this Privacy Policy document. If you do not agree with these terms, please refrain from using the service.' }),
        new Element('p', { class: 'text', style: { marginTop: '1rem' }, innerHTML: 'If you have any questions or concerns about these terms, please contact us at contact [at] nhentai [dot] zip.' })
      ]),
      new Element('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90dvw', marginTop: '1rem' } }, [
        new Element('a', { class: 'text', href: 'javascript:history.back()', innerHTML: 'Back' })
      ])
    ])
  }
}
