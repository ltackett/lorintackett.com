type Offset = {
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
}

type Category =
  'Nightscapes' |
  'Nightscape Portraits' |
  "Landscapes" |
  "Norwegian Island Life" |
  "Portraits of Trees" |
  "Redwood Forest Triptych" |
  "Tillamook Forest Triptych" |
  "Miniature Mountains Triptych"

type Photo = {
  id: string;
  type: 'photo' | 'triptych';
  filename: string;
  path: string;
  title: string;
  description: string;
  categories: Category[];
  triptychId?: string;
  triptychPath?: string;
  offset?: Offset;
}

const createPhotoRecord = (photoDetails: Omit<Photo, 'path' | 'id'>): Photo => {
  let id = photoDetails.filename.replace(/\s/g, '_');
  let triptychId = undefined;

  id = id.replace('.jpg', '')

  if (photoDetails.type === 'triptych') {
    triptychId = id.replace(/_(01|02|03)/, '')
  }

  return {
    ...photoDetails,
    id,
    triptychId,
    path: `photos/${id}`,
    triptychPath: `triptychs/${triptychId}`,
  }
}

export const photos: Photo[] = [
  createPhotoRecord({
    filename: '2017-03-10 Mexico Sunrise - 8x10.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Portraits of Trees'],
  }),
  createPhotoRecord({
    filename: '2017-07-04 Fireworks 8x12.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Nightscapes'],
  }),
  createPhotoRecord({
    filename: '2018-06-05 Chahalis River - 8x12.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Landscapes'],
  }),
  createPhotoRecord({
    filename: '2019-07-12 Miniature Mountains 03 - 12x12.jpg',
    type: 'triptych',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Miniature Mountains Triptych'],
  }),
  createPhotoRecord({
    filename: '2019-07-12 Miniature Mountains 02 - 12x12.jpg',
    type: 'triptych',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Miniature Mountains Triptych'],
  }),
  createPhotoRecord({
    filename: '2019-07-12 Miniature Mountains 01 - 12x12.jpg',
    type: 'triptych',
    title: 'Miniature Mountains',
    description: 'Taken from a plane on my way from Seattle to Reykjavík, this is actually the same mountain from a handful of angles, with one of them reversed. The tilt-shift effect was applied in post.',
    categories: ['Miniature Mountains Triptych'],
  }),
  createPhotoRecord({
    filename: '2019-07-14 Korsholmen Island - 8x12.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Norwegian Island Life'],
    offset: {
      right: 50
    }
  }),
  createPhotoRecord({
    filename: '2019-07-14 Lazy Dog Cafe - 8x12.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Norwegian Island Life'],
    offset: {
      right: 50
    }
  }),
  createPhotoRecord({
    filename: '2019-07-14 The Boat 16x7.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Norwegian Island Life'],
    offset: {
      left: 50
    }
  }),
  createPhotoRecord({
    filename: '2020-05-09 1957 International Truck.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Nightscapes'],
  }),
  createPhotoRecord({
    filename: '2020-07-17 Bryce Canyon.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Nightscapes'],
    offset: {
      bottom: 50
    }
  }),
  createPhotoRecord({
    filename: '2020-07-18 Comet NEOWISE at The Toadstools.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Nightscapes'],
  }),
  createPhotoRecord({
    filename: '2020-07-19 Lightpainting at The Toadstools.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Nightscapes'],
  }),
  createPhotoRecord({
    filename: '2020-08-14 Tree of Life at Night.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Nightscapes', 'Portraits of Trees'],
    offset: {
      bottom: 50
    }
  }),
  createPhotoRecord({
    filename: '2020-08-15 Tree of Life at Dawn.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Nightscapes', 'Portraits of Trees'],
    offset: {
      bottom: 50
    }
  }),
  createPhotoRecord({
    filename: '2020-11-05 Garibaldi Oregon Forest 03.jpg',
    type: 'triptych',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Tillamook Forest Triptych'],
  }),
  createPhotoRecord({
    filename: '2020-11-05 Garibaldi Oregon Forest 02.jpg',
    type: 'triptych',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Tillamook Forest Triptych'],
  }),
  createPhotoRecord({
    filename: '2020-11-05 Garibaldi Oregon Forest 01.jpg',
    type: 'triptych',
    title: 'Tillamook Forest',
    description: 'Layers of trees and fog in the Pacific Northwest near Garibaldi, Oregon',
    categories: ['Tillamook Forest Triptych'],
  }),
  createPhotoRecord({
    filename: '2020-11-08 At The Edge Of Space.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Nightscapes'],
  }),
  createPhotoRecord({
    filename: '2020-11-08 Heceta Lighthouse.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Landscapes'],
  }),
  createPhotoRecord({
    filename: '2020-11-10 Secret Beach BW.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Landscapes'],
  }),
  createPhotoRecord({
    filename: '2020-11-10 Secret Beach Sunrise.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Landscapes'],
  }),
  createPhotoRecord({
    filename: '2020-11-13 Foggy Redwood Forrest 03.jpg',
    type: 'triptych',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Redwood Forest Triptych'],
  }),
  createPhotoRecord({
    filename: '2020-11-13 Foggy Redwood Forrest 02.jpg',
    type: 'triptych',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Redwood Forest Triptych'],
  }),
  createPhotoRecord({
    filename: '2020-11-13 Foggy Redwood Forrest 01.jpg',
    type: 'triptych',
    title: 'Redwood Forest',
    description: 'Deep in the Redwood forest, the sun peaking through patches of fog.',
    categories: ['Redwood Forest Triptych'],
  }),
  createPhotoRecord({
    filename: '2020-11-15 Redwood Tree Portraits 01.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Portraits of Trees'],
  }),
  createPhotoRecord({
    filename: '2020-11-15 Redwood Tree Portraits 02.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Portraits of Trees'],
  }),
  createPhotoRecord({
    filename: '2021-02-27 Portrait of a Tree at Kalaloch.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Portraits of Trees'],
  }),
  createPhotoRecord({
    filename: '2021-03-27 Before Dawn.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ["Landscapes"],
  }),
  createPhotoRecord({
    filename: '2021-03-27 Gas Giant.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Nightscapes'],
  }),
  createPhotoRecord({
    filename: '2021-05-09 Knight Grain Elevator.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Nightscapes'],
  }),
  createPhotoRecord({
    filename: '2021-05-11 Between The Toadstools.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Nightscapes'],
  }),
  createPhotoRecord({
    filename: '2021-05-13 Sandstone and Sky.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Nightscapes'],
  }),
  createPhotoRecord({
    filename: '2021-05-22 The Dalles from Horsethief Butte 01.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Nightscapes'],
  }),
  createPhotoRecord({
    filename: '2021-05-30 Ian Switzler - A Northwest Original FINAL.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Nightscape Portraits'],
  }),
  createPhotoRecord({
    filename: '2021-05-30 Ian Switzler - Cigars and Star Gazing.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Nightscape Portraits'],
  }),
  createPhotoRecord({
    filename: '2021-06-08 Night Wings FINAL WATERMARKED.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Nightscape Portraits'],
  }),
  createPhotoRecord({
    filename: '2021-06-15 Aurora.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Nightscapes'],
  }),
  createPhotoRecord({
    filename: '2021-07-03 Every Tree Points to a Star FINAL WATERMARKED-5.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Nightscapes', 'Portraits of Trees'],
    offset: {
      bottom: 50
    }
  }),
  createPhotoRecord({
    filename: '2021-08-06 Tahoma from Buroughs Mountain CROPPED.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Nightscapes'],
  }),
  createPhotoRecord({
    filename: '2021-08-11 Ruby Beach Moonset.jpg',
    type: 'photo',
    title: 'TITLE',
    description: 'DESCRIPTION',
    categories: ['Nightscapes'],
    offset: {
      left: 50
    }
  })];
