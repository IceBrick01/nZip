import { Element } from '@lightbery/scope'

/**
 * Home page
 * @param args Arguments
 * @param args.version Version of nZip
 * @returns Object containing the page title, description, keywords and content
 */
// prettier-ignore
export default (args: { version: string }) => {
  return {
    title: 'nZip | Home',
    description: 'Easily download the doujinshi you like.',
    keywords: 'nZip, nhentai, doujinshi, download, zip',
    content: new Element('body', { style: { display: 'flex', flexDirection: 'column', center: 'horizontal vertical', backgroundColor: '$background_color', margin: '0px', width: '100dvw', height: '100dvh' } }, [
      new Element('div', { style: { position: 'fixed', display: 'flex', center: 'horizontal vertical', left: '0px', top: '0px', width: '100dvw', height: '100dvh', zIndex: '-1' } }, [
        new Element('h1', { id: 'text_sauce', class: 'text', style: { userSelect: 'none', fontSize: '20rem', opacity: '0.075' } })
      ]),
      new Element('div', { style: { marginLeft: '1rem', marginRight: '1rem' } }, [
        new Element('h1', { class: 'text', innerHTML: '<span style="color: #d83e57ff">n</span>Zip', style: { fontSize: '2.75rem', whiteSpace: 'nowrap', margin: '0px' } }),
        new Element('h1', { class: 'text', innerHTML: 'Easily download the doujinshi you like.', style: { fontSize: '1.25rem', fontWeight: 'normal', margin: '0px', marginBottom: '0.75rem' } }),
        new Element('input', { id: 'input_sauce', type: 'text', placeholder: 'The Sauce', style: { outline: 'none', backgroundColor: '$background_color', color: '$text_color', border: '0.1rem solid $text_color', borderRadius: '0.25rem', fontSize: '1.25rem', fontWeight: 'normal', padding: '0.5rem 0.5rem', width: '100% - 1.5rem' } }),
        new Element('div', { style: { display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '1rem', gap: '0.5rem' } }, [
          new Element('a', { class: 'text', href: '/terms', innerHTML: 'Terms', style: { fontSize: '1rem' } }),
          new Element('h1', { class: 'text', innerHTML: 'and', style: { fontSize: '1rem' } }),
          new Element('a', { class: 'text', href: '/privacy', innerHTML: 'Privacy', style: { fontSize: '1rem' } })
       ])
      ]),
      new Element('div', { style: { position: 'fixed', display: 'flex', fontSize: '1rem', bottom: '0.6rem', width: '100dvw' } }, [
        new Element('div', { style: { display: 'flex', center: 'vertical', gap: '0.5rem', marginLeft: '1rem', marginRight: '1rem' } }, [
          new Element('h1', { class: 'text', style: { fontSize: '1rem' }, innerHTML: 'Made by' }),
          new Element('a', { class: 'text', href: 'https://github.com/noticebrick', target: '_blank', innerHTML: 'IceBrick', style: { fontSize: '1rem', fontWeight: 'bold' } }),
          new Element('h1', { class: 'text', innerHTML: 'and', style: { fontSize: '1rem' } }),
          new Element('a', { class: 'text', href: 'https://github.com/LmanTW', target: '_blank', innerHTML: 'LmanTW', style: { fontSize: '1rem', fontWeight: 'bold' } }),
          new Element('h1', { class: 'text', innerHTML: 'with ❤️', style: { fontSize: '1rem' } })
        ]),
        new Element('div', { style: { flex: '1' } }),
        new Element('h1', { class: 'text', style: { fontSize: '1rem', whiteSpace: 'nowrap', marginRight: '1rem' } }, [
          new Element('a', { href: 'https://github.com/nZip-Team/nZip', target: '_blank', innerHTML: `nZip ${args.version}` })
        ])
      ]),
      new Element('script', { src: '/Scripts/Home.mjs' })
    ])
  }
}
