export interface LayerOption {
  type: 'label' | 'vector' | 'overlay' | 'group' | 'model';
  id: 'string';
}

export type AutoColor = number[] | string;

export interface ViewPoint {}
