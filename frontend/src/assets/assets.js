import img1 from './img1.jpg'
import img2 from './img2.jpg'
import img3 from './img3.jpg'
import img4 from './img4.jpg'
import logo from './logo.png'
import logo2 from './logo2.png'
import logo3 from './logo3.png'
import sabah from './sabah.png'
import sarawak from './sarawak.png'
import selangor from './selangor.png'
import pulau_pinang from './pulau_pinang.png'
import perlis from './perlis.png'
import perak from './perak.png'
import pahang from './pahang.png'
import negeri_sembilan from './negeri_sembilan.png'
import melaka from './melaka.png'
import kelantan from './kelantan.png'
import kedah from './kedah.png'
import johor from './johor.png'
import terengganu from './terengganu.png'
import wilayah_persekutuan from './wilayah_persekutuan.png'
import profile_pic from './profile_pic.jpg'
import longlong from './longlong.jpg'
import ella from './ella.jpg'
import dropdown_icon from './dropdown_icon.png'
import arrow_icon from './arrow_icon.png'
import gunung_kinabalu from './gunung_kinabalu.jpg'
import bukit_mensilou  from './bukit_mensilou.jpg'
import gunung_arong from './gunung_arong.jpg'
import gunung_mulu from './gunung_mulu.jpg'
import maragang_hill from './maragang_hill.jpg'
import mascot from './mascot.png'
import star_dull_icon from './star_dull_icon.png'
import star_icon from './star_icon.png'
import rent_pole from './rent_pole.jpg'
import rent_headLamp from './rent_headLamp.jpg'
import clear from './clear.png'
import clouds from './clouds.png'
import drizzle from './drizzle.png'
import humidity from './humidity.png'
import mist from './mist.png'
import rain from './rain.png'
import wind from './wind.png'
import snow from './snow.png'
import thermometer from './thermometer.png'
import windy from './windy.png'
import menu from './menu.png'
import menu_1 from './menu_1.png'
import close from './close.png'
import trophy_gold from './trophy_gold.png'
import trophy_silver from './trophy_silver.png'
import trophy_bronze from './trophy_bronze.png'
import points from './points.png'
import person_icon from './person_icon.svg'
import mail_icon from './mail_icon.svg'
import lock_icon from './lock_icon.svg'
import default_image from './default_image.jpg'

export const assets = {
    img1,
    img4,
    logo,
    logo2,
    logo3,
    profile_pic,
    dropdown_icon,
    arrow_icon,
    mascot,
    star_dull_icon,
    star_icon,
    clear,
    clouds,
    drizzle,
    humidity,
    mist,
    rain,
    wind,
    snow,
    thermometer,
    windy,
    menu,
    menu_1,
    close,
    trophy_gold,
    trophy_silver,
    trophy_bronze,
    points,
    person_icon,
    mail_icon,
    lock_icon,
    default_image
}

export const trailsData = [
    {
        state: 'Sabah',
        image: sabah
    },
    {
        state: 'Sarawak',
        image: sarawak
    },
    {
        state: 'Terengganu',
        image: terengganu
    },
    {
        state: 'Selangor',
        image: selangor
    },
    {
        state: 'Pulau Pinang',
        image: pulau_pinang
    },
    {
        state: 'Perlis',
        image: perlis
    },
    {
        state: 'Perak',
        image: perak
    },
    {
        state: 'Pahang',
        image: pahang
    },
    {
        state: 'Negeri Sembilan',
        image:  negeri_sembilan
    },
    {
        state: 'Melaka',
        image: melaka
    },
    {
        state: 'Kelantan',
        image: kelantan
    },
    {
        state: 'Kedah',
        image: kedah
    },
    {
        state: 'Johor',
        image: johor
    },
    {
        state: 'Wilayah Persekutuan',
        image: wilayah_persekutuan
    },
]

export const trails = [
    {
        _id: 't1',
        name: 'Gunung Kinabalu',
        image: [gunung_kinabalu, img2],
        state: 'Sabah',
        location: 'kundasang',
        nationality: {
            malaysian: 1222,
            foreign: 1500,
        }, 
        packages: [
            {
                duration: ['3 days 2 nights'],
                stays: [
                    {
                        place: 'Poring Hot Spring dormitory & Laban Rata Resthouse',
                        price: 200,
                        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8148018.265485645!2d104.94849334999995!3d4.31204381708447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x323bbde27680ca83%3A0x6e1212d7f13696ea!2sPoring%20Hot%20Spring!5e0!3m2!1sen!2smy!4v1729694964133!5m2!1sen!2smy'
                    },
                    {
                        place: 'Kinabalu Park & Laban Rata Resthouse',
                        price: 300,
                        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63483.58460652691!2d116.5167521394769!3d6.032559851879865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x323b9886e1eb113f%3A0x983767a5811b5f0a!2sKinabalu%20Park%2C%20Ranau%2C%20Sabah!5e0!3m2!1sen!2smy!4v1729696987862!5m2!1sen!2smy'
                    }
                ]
            },
            {
                duration: ['2 days 1 night'],
                stays: [
                    {
                        place: 'Laban Rata Resthouse',
                        price: 100,
                        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8148018.265485645!2d104.94849334999995!3d4.31204381708447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x323bbde27680ca83%3A0x6e1212d7f13696ea!2sPoring%20Hot%20Spring!5e0!3m2!1sen!2smy!4v1729694964133!5m2!1sen!2smy'
                    }
                ]
            },

        ],
        mealsOption: [{ mealsIncluded: true, price: 0 }],

        guideOption: [
            {
              guideIncluded: true,
              price: 0,
              guidesInfo: [
                {
                  guideName: 'Atiq',
                  contactNumber: '0134567895',
                  email: 'atiq@gmail.com',
                  experience: '5 years',
                },
                {
                    guideName: 'Harith',
                    contactNumber: '016589756',
                    email: 'harith@gmail.com', // Guide's email
                    experience: '5 years',
                  },
              ],
            },
          ],
          
       
        
        rentalOptions: [
            { item: 'Hiking Pole', image: rent_pole, price: 10 },
            { item: 'Head Lamp', image: rent_headLamp, price: 5 }
        ],
        reviews: [
            {
                userName: 'Aman Yasser',
                image: longlong,
                trailImage: img1,
                comment: 'Amazing experience! Highly recommend.'
            },
            {
                userName: 'Isabella',
                image: ella,
                trailImage: img2,
                comment: 'Loved the view, but it was challenging.'
            }
        ]
    },
    {
        _id: 't2',
        name: 'Bukit Mensilou',
        image: [bukit_mensilou],
        state: 'Sabah',
        location: 'kundasang',
        nationality: {
            malaysian: 1222,
            foreign: 1500,
        }, 
        packages: [
            {
                duration: ['30 minutes'],
                stays: [],
                mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.8484591645647!2d116.59490337474894!3d6.0155343939698325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x323b99bd072b54e7%3A0x61b1557a9f0f5272!2sMesilou%203Sixty%20Peak!5e0!3m2!1sen!2smy!4v1729697063924!5m2!1sen!2smy',
            }
        ],
       
        mealsOption: [{ mealsIncluded: false, price: 0 }],

        guideOption: [
            { 
                guideIncluded: false, 
                price: 0 ,
                guidesInfo: [ ] 
            }],

        rentalOptions: [],
        reviews: [
            {
                userName: 'ella',
                image: ella,
                comment: 'A short but scenic hike!'
            }
        ]
    },
    {
        _id: 't3',
        name: 'Bukit Maragang',
        image: [maragang_hill, img3],
        state: 'Sabah',
        location: 'kundasang',
        nationality: {
            malaysian: 1222,
            foreign: 1500,
        }, 
        packages: [
            {
                duration: ['50 minutes'],
                stays: [],
                mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.8662521021693!2d116.59762978095654!3d6.013095732748573!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x323b995415bcc985%3A0xfcb8cca1709f8ca9!2sMaragang%20Hill%20Registration%20Center!5e0!3m2!1sen!2smy!4v1729697465444!5m2!1sen!2smy',
            }
        ],
       
        mealsOption: [
            { mealsIncluded: true, price: 10 },
            { mealsIncluded: false, price: 0 },
            
        ],
        guideOption: [
            {
              guideIncluded: true,
              price: 50,
              guidesInfo: [
                {
                  guideName: 'Jeffery',
                  contactNumber: '019526879',
                  email: 'jeffery@gmail.com',
                  experience: '5 years',
                },
              ],
            },
            {
              guideIncluded: false,
              price: 0,
              guidesInfo: [],
            },
          ],
          


        rentalOptions: [{ item: 'Head Lamp', image: rent_headLamp, price: 5 }],
        reviews: []
    },
    {
        _id: 't4',
        name: 'Gunung Mulu National Park',
        image: [gunung_mulu],
        state: 'Sarawak',
        location: '',
        nationality: {
            malaysian: 1222,
            foreign: 1500,
        }, 
        packages: [
            {
                duration: ['4 days 3 nights'],
                stays: [],
                mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d254705.44653631237!2d114.7353316178647!3d4.066705581363238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x321903b651d89c1d%3A0xcc556a8cef339f29!2sGunung%20Mulu%20National%20Park!5e0!3m2!1sen!2smy!4v1729697519831!5m2!1sen!2smy',
            }
        ],
        mealsOption: [{ mealsIncluded: true, price: 0 }],
        guideOption: [
            {
              guideIncluded: true,
              price: 0,
              guidesInfo: [
                {
                  guideName: 'Adli',
                  contactNumber: '0136985746',
                  email: 'Adli@gmail.com', // Guide's email
                  experience: '5 years',
                },
              ],
            },
          ],
          
        rentalOptions: [],
        reviews: []
    },
    {
        _id: 't5',
        name: 'Gunung Arong',
        image: [gunung_arong],
        state: 'Johor',
        location: '',
        nationality: {
            malaysian: 1222,
            foreign: 1500,
        }, 
        packages: [
            {
                duration: ['1 hour 30 minutes'],
                stays: [],
                mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127551.66737759339!2d103.66751878239256!3d2.510280857198215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31c54fc988080b27%3A0x2079b69208029671!2sGunung%20Arong%20Recreational%20Forest%2C%20Mersing%2C%20Johor!5e0!3m2!1sen!2smy!4v1729697590076!5m2!1sen!2smy',
            }
        ],
        mealsOption: [
            { mealsIncluded: true, price: 15 },
            { mealsIncluded: false, price: 0 }
        ],
        guideOption: [
            {
              guideIncluded: true,
              price: 60,
              guidesInfo: [
                {
                  guideName: 'Iman',
                  contactNumber: '016589756',
                  email: 'iman@gmail.com', // Guide's email
                  experience: '5 years',
                },
                {
                  guideName: 'Harith',
                  contactNumber: '016589756',
                  email: 'harith@gmail.com', // Guide's email
                  experience: '5 years',
                },
              ],
            },
            {
              guideIncluded: false,
              price: 0,
              guidesInfo: [],
            },
          ],
          
        rentalOptions: [],
        reviews: []
    }
];



export const leaderboard = [
    {
        name: "Ishamisha",
        image: profile_pic,
        email: 'Bunga_0817@gmail.com',
        phone: '+60 13 558 5794',
        address: {
            line1: "57th Cross, Richmond",
            line2: "Circle, Mosque Road, Malaysia"
        },
        gender: 'Female',
        dob: '2002-08-05',
        points: '200',

    },
    {
        name: "Aman Yasser",
        image: longlong,
        email: 'yasha851710@gmail.com',
        phone: '+60 11 1483 9194',
        address: {
            line1: "57th Cross, Richmond",
            line2: "Circle, Mosque Road, Malaysia"
        },
        gender: 'Male',
        dob: '1989-10-17',
        points: '258',

    },
    {
        name: "Isabella",
        image: ella,
        email: 'isabella@gmail.com',
        phone: '+60 13 557 3734',
        address: {
            line1: "57th Cross, Richmond",
            line2: "Circle, Mosque Road, Malaysia"
        },
        gender: 'Female',
        dob: '2006-04-12',
        points: '50',

    },
    {
        name: "Shasha",
        image: mascot,
        email: 'isabella@gmail.com',
        phone: '+60 13 557 3734',
        address: {
            line1: "57th Cross, Richmond",
            line2: "Circle, Mosque Road, Malaysia"
        },
        gender: 'Female',
        dob: '2006-04-12',
        points: '50',

    },
    {
        name: "Izz",
        image: mascot,
        email: 'isabella@gmail.com',
        phone: '+60 13 557 3734',
        address: {
            line1: "57th Cross, Richmond",
            line2: "Circle, Mosque Road, Malaysia"
        },
        gender: 'Female',
        dob: '2006-04-12',
        points: '12',

    },
    {
        name: "Ara",
        image: mascot,
        email: 'isabella@gmail.com',
        phone: '+60 13 557 3734',
        address: {
            line1: "57th Cross, Richmond",
            line2: "Circle, Mosque Road, Malaysia"
        },
        gender: 'Female',
        dob: '2006-04-12',
        points: '30',

    },
    {
        name: "Eve",
        image: mascot,
        email: 'isabella@gmail.com',
        phone: '+60 13 557 3734',
        address: {
            line1: "57th Cross, Richmond",
            line2: "Circle, Mosque Road, Malaysia"
        },
        gender: 'Female',
        dob: '2006-04-12',
        points: '20',

    },
    {
        name: "Irish",
        image: mascot,
        email: 'isabella@gmail.com',
        phone: '+60 13 557 3734',
        address: {
            line1: "57th Cross, Richmond",
            line2: "Circle, Mosque Road, Malaysia"
        },
        gender: 'Female',
        dob: '2006-04-12',
        points: '50',

    },
    {
        name: "Ayaan",
        image: mascot,
        email: 'isabella@gmail.com',
        phone: '+60 13 557 3734',
        address: {
            line1: "57th Cross, Richmond",
            line2: "Circle, Mosque Road, Malaysia"
        },
        gender: 'Female',
        dob: '2006-04-12',
        points: '13',

    },

];

  