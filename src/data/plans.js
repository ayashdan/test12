export const PLANS = {
  '2x': {
    label: '2× / week',
    subtitle: 'Full Body A / Full Body B',
    days: [
      { name: 'Full Body A', muscles: ['Chest', 'Back', 'Legs', 'Shoulders'] },
      { name: 'Full Body B', muscles: ['Chest', 'Back', 'Legs', 'Arms'] },
    ],
  },
  '3x': {
    label: '3× / week',
    subtitle: 'Push / Pull / Legs',
    days: [
      { name: 'Push', muscles: ['Chest', 'Shoulders', 'Triceps'] },
      { name: 'Pull', muscles: ['Back', 'Biceps'] },
      { name: 'Legs', muscles: ['Quads', 'Hamstrings', 'Glutes', 'Calves'] },
    ],
  },
  '4x': {
    label: '4× / week',
    subtitle: 'Upper / Lower Split',
    days: [
      { name: 'Upper A', muscles: ['Chest', 'Back', 'Shoulders', 'Arms'] },
      { name: 'Lower A', muscles: ['Quads', 'Hamstrings', 'Glutes'] },
      { name: 'Upper B', muscles: ['Chest', 'Back', 'Shoulders', 'Arms'] },
      { name: 'Lower B', muscles: ['Quads', 'Hamstrings', 'Calves'] },
    ],
  },
  '5x': {
    label: '5× / week',
    subtitle: 'Bro Split + Full Body',
    days: [
      { name: 'Chest + Tri', muscles: ['Chest', 'Triceps'] },
      { name: 'Back + Bi', muscles: ['Back', 'Biceps'] },
      { name: 'Legs', muscles: ['Quads', 'Hamstrings', 'Glutes', 'Calves'] },
      { name: 'Shoulders', muscles: ['Shoulders', 'Traps'] },
      { name: 'Full Body', muscles: ['Chest', 'Back', 'Legs', 'Shoulders'] },
    ],
  },
  '6x': {
    label: '6× / week',
    subtitle: 'PPL × 2',
    days: [
      { name: 'Push A', muscles: ['Chest', 'Shoulders', 'Triceps'] },
      { name: 'Pull A', muscles: ['Back', 'Biceps'] },
      { name: 'Legs A', muscles: ['Quads', 'Hamstrings', 'Glutes'] },
      { name: 'Push B', muscles: ['Chest', 'Shoulders', 'Triceps'] },
      { name: 'Pull B', muscles: ['Back', 'Biceps'] },
      { name: 'Legs B', muscles: ['Quads', 'Hamstrings', 'Calves'] },
    ],
  },
}
