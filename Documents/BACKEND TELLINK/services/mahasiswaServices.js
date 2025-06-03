
const { getFirestoreInstance } = require('../firebase/firebase');
const { collection, query, where, getDocs } = require('firebase/firestore');

const getMahasiswaByNimValue = async (nim) => {
    const firestoredb = getFirestoreInstance();
    const mahasiswaRef = collection(firestoredb, 'mahasiswa');
    const q = query(mahasiswaRef, where('nim', '==', nim));
    const mahasiswaSnapshot = await getDocs(q)

    if(mahasiswaSnapshot.empty){
        return null;
    }

    return  mahasiswaSnapshot.docs[0].data();
}

module.exports = {
    getMahasiswaByNimValue
}
