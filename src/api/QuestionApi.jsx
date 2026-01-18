import axios from './axiosClient'

const Question = {
    getQuestions: () => 
        axios.get("/question/getquestions")
}

export default Question