import Posting from "../../models/Posting.js";

//게시글 올릴 때 - 정보 받아다가 DB에 doc 생성하기
const upload = async (req, res) => {
    const { hashtag, content, userId } = req.body;
    //hashtag를 formData로 보내면 이런식으로 들어온다. (배열이 아닌 string형식)
    //heelo,ooo
    //img가 req.files로 들어온다. (여러장이라) 
    const images = req.files;
    //console.log('images', images)
    const path = images.map(img => img.location)
    //console.log('path', path)
    //path [
    //'https://senna-image.s3.ap-northeast-2.amazonaws.com/1624947227543.jpg',
    //'https://senna-image.s3.ap-northeast-2.amazonaws.com/1624947227544.jpg',
    //'https://senna-image.s3.ap-northeast-2.amazonaws.com/1624947227570.jpg'
    //]
    let tagArr = hashtag.split(', ');

    if(!hashtag || !content || !userId || !images) {
        res.status(400).send('필수 요소가 들어오지 않았습니다.')
    }

    try {
        const newPosting = await Posting.create({
            userId,
            content,
            image: path,
            hashtag: tagArr
        })

        console.log('newPosting', newPosting);
        return res.send({
            data: newPosting,
            message: '게시물 등록 성공'
        })
    } catch(err) {
        res.status(err.status || 500).send(err.message || 'error')
    }
}

export default upload;