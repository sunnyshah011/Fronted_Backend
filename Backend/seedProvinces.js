// // seedProvinces.js
// import 'dotenv/config';
// import connectDB from "./config/mongodb.js";
// import Province from "./models/location.model.js";

// const provincesData = [
//     {
//         name: "Koshi Province",
//         districts: [
//             { name: "Bhojpur" },
//             { name: "Dhankuta" },
//             { name: "Ilam" },
//             { name: "Jhapa" },
//             { name: "Khotang" },
//             { name: "Morang" },
//             { name: "Okhaldhunga" },
//             { name: "Panchthar" },
//             { name: "Sankhuwasabha" },
//             { name: "Solukhumbu" },
//             { name: "Sunsari" },
//             { name: "Taplejung" },
//             { name: "Terhathum" },
//             { name: "Udayapur" },
//         ],
//     },
//     {
//         name: "Madhesh Province",
//         districts: [
//             { name: "Bara" },
//             { name: "Dhanusha" },
//             { name: "Mahottari" },
//             { name: "Parsa" },
//             { name: "Rautahat" },
//             { name: "Saptari" },
//             { name: "Sarlahi" },
//             { name: "Siraha" },
//         ],
//     },
//     {
//         name: "Bagmati Province",
//         districts: [
//             { name: "Bhaktapur" },
//             { name: "Chitwan" },
//             { name: "Dhading" },
//             { name: "Dolakha" },
//             { name: "Kathmandu" },
//             { name: "Kavrepalanchok" },
//             { name: "Lalitpur" },
//             { name: "Makwanpur" },
//             { name: "Nuwakot" },
//             { name: "Ramechhap" },
//             { name: "Rasuwa" },
//             { name: "Sindhuli" },
//             { name: "Sindhupalchok" },
//         ],
//     },
//     {
//         name: "Gandaki Province",
//         districts: [
//             { name: "Baglung" },
//             { name: "Gorkha" },
//             { name: "Kaski" },
//             { name: "Lamjung" },
//             { name: "Manang" },
//             { name: "Mustang" },
//             { name: "Myagdi" },
//             { name: "Nawalpur" },
//             { name: "Parbat" },
//             { name: "Syangja" },
//             { name: "Tanahun" },
//         ],
//     },
//     {
//         name: "Lumbini Province",
//         districts: [
//             { name: "Arghakhanchi" },
//             { name: "Banke" },
//             { name: "Bardiya" },
//             { name: "Dang" },
//             { name: "Gulmi" },
//             { name: "Kapilvastu" },
//             { name: "Parasi" },
//             { name: "Palpa" },
//             { name: "Pyuthan" },
//             { name: "Rolpa" },
//             { name: "Rukum East" },
//             { name: "Rupandehi" },
//         ],
//     },
//     {
//         name: "Karnali Province",
//         districts: [
//             { name: "Dailekh" },
//             { name: "Dolpa" },
//             { name: "Humla" },
//             { name: "Jajarkot" },
//             { name: "Jumla" },
//             { name: "Kalikot" },
//             { name: "Mugu" },
//             { name: "Rukum West" },
//             { name: "Salyan" },
//             { name: "Surkhet" },
//         ],
//     },
//     {
//         name: "Sudurpashchim Province",
//         districts: [
//             { name: "Achham" },
//             { name: "Baitadi" },
//             { name: "Bajhang" },
//             { name: "Bajura" },
//             { name: "Dadeldhura" },
//             { name: "Darchula" },
//             { name: "Kailali" },
//             { name: "Kanchanpur" },
//         ],
//     },
// ];



// const seedProvinces = async () => {
//     try {
//         await connectDB();

//         // Clear existing data (optional)
//         await Province.deleteMany({});
//         console.log("Existing provinces removed");

//         // Insert all provinces
//         await Province.insertMany(provincesData);
//         console.log("Provinces inserted successfully");

//         process.exit(0);
//     } catch (error) {
//         console.error("Error seeding provinces:", error);
//         process.exit(1);
//     }
// }

// seedProvinces();
