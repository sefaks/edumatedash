
interface Quiz {
    id: string;
    title: string;
    results: {
      questions: {
        questionId: string;
        text: string;
      }[];
      answers: { [key: string]: string };
    };
  }