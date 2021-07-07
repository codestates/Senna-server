import User from '../../models/User.js'
import s3 from '../../config/s3.js'
import { checkType } from '../../utils/multer.js';
import { encryption } from '../../utils/setPwd.js';
//
const updateProfile = async (req, res) => {
    
    const { password } = req.body;
    const profileImg = req.file.location;
    const type = req.file.mimetype.split('/')[1]
    const encryptedPwd = encryption(password);
    if(!checkType(type)) {
        return res.status(400).send('잘못된 파일 형식입니다.')
    } else {
        await User.findById(
        req.params.id
        ).then((data) => {
            if(!data) {
                res.status(401).send('잘못된 접근입니다');
            } else {
              //pw 만인지 여부 확인 if()
                const id = data._id;
                //oldImg에서 name값만 가져오기
                const oldImg = data.profileImg.split('com/')[1];
                s3.deleteObject({
                    Bucket: 'senna-image',
                    Key: oldImg
                }, (err, data) => {
                    if(err) {
                        console.log(err)
                    }
                    console.log('기존 이미지 삭제', data)
                });
                User.findByIdAndUpdate(id, { password: encryptedPwd, profileImg: profileImg },
                    function (err, docs) {
                        if (err){
                            console.log(err)
                        } else {
                            res.status(200).send("회원정보가 수정되었습니다");
                        }
                    }
                );
                
            }
        
        })
    }
}

export default updateProfile
