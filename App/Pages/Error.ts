import { Element } from "../../Server/Scope";

export default (args: { error: string }) => {
  return {
    title: 'nZip | Error',
    description: 'Something went wrong.',
    content: new Element('body', { style: { display: 'flex', flexDirection: 'column', center: 'horizontal vertical', backgroundColor: '$background_color', margin: '0px', width: '100dvw', height: '100dvh' } }, [
      new Element('h1', { class: 'text', style: { fontSize: '4rem' }, innerHTML: 'Error' }),
      new Element('h1', { class: 'text', style: { fontSize: '1.25rem', maxWidth: '90dvw' }, innerHTML: `${args.error}` })
    ])
  }
}