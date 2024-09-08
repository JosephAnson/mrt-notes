export interface Marker {
  name: string
  src: string
}

export const markers: Marker[] = [
  { name: 'skull', src: '/skull.png' },
  { name: 'cross', src: '/cross.png' },
  { name: 'circle', src: '/circle.png' },
  { name: 'star', src: '/star.png' },
  { name: 'square', src: '/square.png' },
  { name: 'triangle', src: '/triangle.png' },
  { name: 'diamond', src: '/diamond.png' },
  { name: 'moon', src: '/moon.png' },
]

export const wowColors = {
  'Death Knight': '#C41F3B',
  'Druid': '#FF7D0A',
  'Hunter': '#ABD473',
  'Mage': '#69CCF0',
  'Monk': '#00FF96',
  'Paladin': '#F58CBA',
  'Priest': '#FFFFFF',
  'Rogue': '#FFF569',
  'Shaman': '#0070DE',
  'Warlock': '#9482C9',
  'Warrior': '#C79C6E',
  'Evoker': '#33937F',
  'Demon Hunter': '#a330c9',
}

export const wowColorsVariants = {
  'Death Knight': 'bg-[#C41F3B] text-white',
  'Druid': 'bg-[#FF7D0A] text-white',
  'Hunter': 'bg-[#ABD473] text-black',
  'Mage': 'bg-[#69CCF0] text-white',
  'Monk': 'bg-[#00FF96] text-black',
  'Paladin': 'bg-[#F58CBA] text-white',
  'Priest': 'bg-[#FFFFFF] text-black',
  'Rogue': 'bg-[#FFF569] text-black',
  'Shaman': 'bg-[#0070DE] text-white',
  'Warlock': 'bg-[#9482C9] text-white',
  'Warrior': 'bg-[#C79C6E] text-white',
  'Evoker': 'bg-[#33937F] text-white',
  'Demon Hunter': 'bg-[#a330c9] text-white',
}
