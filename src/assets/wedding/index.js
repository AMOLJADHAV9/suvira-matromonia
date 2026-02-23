import hero1 from './images/images.jpg'
import hero2 from './images/images (1).jpg'
import hero3 from './images/2c1d762204a185fe69e48aebff654f20.jpg'
import hero4 from './images/b1d27bbe96cc8a1c05d91befc40613a7.jpg'
import hero5 from './images/istockphoto-866987706-612x612.jpg'
import hero6 from './images/istockphoto-2168707868-612x612.jpg'
import angathiRasam from './images/angathi rasam.jpeg'
import southWedding from './images/south wedding.jpg'
import cornerFlower from './images/corner-floower-removebg-preview.png'

export const weddingImages = [hero1, hero2, hero3, hero4, hero5, hero6]
export const cornerFlowerImage = cornerFlower
export const heroBannerImages = weddingImages.slice(0, 4)
// Our Wedding Moments: feature angathi rasam & south wedding first, then rest
export const galleryImages = [angathiRasam, southWedding, ...weddingImages]
export const secondBannerImage = angathiRasam
export const weddingMomentsFeatured = [angathiRasam, southWedding]
