const { collection, query, where, orderBy, onSnapshot,
        getDocs, addDoc } = require('firebase/firestore');
const { getFirestoreInstance } = require('../firebase/firebase');
const bcrypt = require('bcrypt');
const { getMahasiswaByNimValue } = require('../services/mahasiswaServices');


const getMahasiswaByNim = async (req, res) => {
    try {
        const { nim } = req.params;
        const mahasiswa = await getMahasiswaByNimValue(nim);

        if(!mahasiswa){
            return res.status(404).json({success: false, message: 'Mahasiswa tidak ditemukan'})
        }

        res.status(200).json({
            success: true,
            message: 'Mahasiswa ditemukan',
            data: mahasiswa
        })
    } catch (error){
        res.status(500).json({success: false, message: 'Error loading data'})
    }
}

const registerMahasiswa = async (req, res) => {
    try {
        const { nama, nim, password } = req.body;

        if(!nama || !nim || !password){
            return res.status(400).json({success: false, message: 'Nama, NIM, dan password harus diisi'});
        }

        const existingMahasiswa = await getMahasiswaByNimValue(nim);

        if(existingMahasiswa){
            return res.status(400).json({success: false, message: 'NIM sudah terdaftar'});
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const firestoredb = getFirestoreInstance();
        const mahasiswaRef = collection(firestoredb, 'mahasiswa');

        await addDoc(mahasiswaRef, {
            nim,
            password: passwordHash,
            nama,
            jurusan: "",
            angkatan: "",
            requests: [],
            accept: [],
            posts: [],
            totalpost: null,
        });

        res.status(200).json({ success: true, message: 'Mahasiswa berhasil terdaftar'});
    } catch (error){
        console.error('❌ Error registering mahasiswa: ', error);
        res.status(500).json({ success: false, message: 'Error registering mahasiswa'})
    }
}

const loginMahasiswa = async (req, res) => {
    try {
        const { nim, password } = req.body;

        if(!nim || !password){
            return res.status(400).json({success: false, message: 'NIM dan password harus diisi'});
        }

        const firestoredb = getFirestoreInstance();
        const mahasiswaRef = collection(firestoredb, 'mahasiswa');
        const q = query(mahasiswaRef, where('nim', '==', nim))
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty){
            return res.status(401).json({ success: false,message: 'NIM tidak ditemukan' })
        }

        const doc = querySnapshot.docs[0];
        const mahasiswa = doc.data();

        const isPasswordMatch = await bcrypt.compare(password, mahasiswa.password)

        if(!isPasswordMatch){
            return res.status(401).json({ success: false, message: 'Password salah' });
        }

        return res.status(200).json({
            success: true,
            message: 'Login berhasil',
            data: mahasiswa
        });

    } catch(error){
        console.error('❌ Error loading data: ', error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}


const getReqPosts = async (req, res) => {
    try {
        const firestoredb = getFirestoreInstance(); 

        const reqPostCollection = collection(firestoredb, 'reqpost');
        const snapshot = await getDocs(reqPostCollection);

        const posts = snapshot.docs.map(doc => ({
            ...doc.data()
        }));

        res.status(200).json(posts);

    } catch (error){
        console.error('❌ Error loading data: ', error);
        res.status(500).send("Error loading data : ", error);
    }
}    

const getProjectListByNim = (req, res) => { 
    const io = req.app.get('io');

    const nim = req.params.nim; 
    try {
        const firestoredb = getFirestoreInstance();

        const projectRef = collection(firestoredb, 'reqpost');
        const q = query(
            projectRef,
            where('nim', '==', nim),
            orderBy('title')
        );

        // Gunakan onSnapshot untuk mendengarkan perubahan data
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const projects = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                image: doc.data().image || '' // default empty string
            }));

            console.log('Updated project list:', projects);
            io.emit('projectsUpdated', projects);

        });

        // Kirimkan response awal kepada client (optional)
        res.status(200).json({
            success: true,
            message: 'Listening for real-time changes.',
        });

        // Anda bisa mengunakan unsubscribe() jika ingin berhenti mendengarkan
        // unsubscribe(); - Jangan panggil ini jika ingin listener berjalan terus

    } catch (error) {
        console.error('❌ Error fetching project list: ', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching project list',
            error: error.message
        });
    }
};

module.exports = {
    getReqPosts,
    loginMahasiswa,
    registerMahasiswa,
    getProjectListByNim
};


