import { Element } from "../../Server/Scope";

export default (args: { id: string, title: string, cover: string }) => {
  return {
    title: `nZip | ${args.id}`,
    description: args.title,
    content: new Element('body', { style: { display: 'flex', flexDirection: 'column', center: 'horizontal vertical', backgroundColor: '$background_color', margin: '0', width: '100%', height: '100dvh' }, 'style:dynamic:minHeight': '<height> + 3rem' }, [
      new Element('div', { class: 'container', style: { display: 'flex', flexShrink: '0', flexWrap: 'wrap', gap: '2rem', center: 'horizontal vertical', margin: '1rem', maxWidth: '100%' } }, [
        new Element('img', { src: `${args.cover}`, class: 'cover-image', style: { borderRadius: '0.25rem', height: '35rem', filter: 'blur(2.5px)' } }),
        new Element('div', { style: { display: 'flex', flexDirection: 'column', center: 'horizontal', alignItems: 'center', maxWidth: '90dvw' } }, [
          new Element('h1', { class: 'text title', style: { fontSize: '1.75rem', margin: '0', marginBottom: '0.75rem', maxWidth: '50dvw' }, innerHTML: `${args.title}` }),
          new Element('div', { id: 'logs', style: { border: '0.2rem solid $text_color', borderRadius: '0.25rem', marginBottom: '0.5rem', width: '100%', height: '20rem', overflowY: 'scroll' } }, [
            new Element('h1', { id: 'text_logs', class: 'text', style: { fontSize: '1rem', fontWeight: 'bold', margin: '0.9rem 0', marginLeft: '0.9rem', width: '100%', textAlign: 'left' }, innerHTML: 'Connecting to the server...' })
          ]),
          new Element('a', { id: 'download_button', class: 'button', target: '_blank', style: { fontSize: '1.5rem', fontWeight: 'bold', padding: '0.5rem 1rem' }, innerHTML: 'Preparing download...' })
        ])
      ]),
      new Element('style', { innerHTML: `
        @media (max-width: 768px) {
          .text.title {
            max-width: 90vw !important;
          }
          #logs {
            height: 10rem !important;
          }
          .cover-image {
            height: 40dvh !important;
          }
        }
      `}),
      new Element('script', { src: '/Scripts/Download.ts' })
    ])
  }
}