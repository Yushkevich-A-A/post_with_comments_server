const faker = require('faker');
faker.locale = 'ru';

class ArrPosts {
    constructor() {
        this.posts = [];
        this.comments = [];
        this.idPosts = 0;
        this.timerPost = null;
        this.timerComment = null;
        this.init();
    }

    init() {
        this.createInitialPosts();
        this.createTimers();
    }

    createInitialPosts() {
        for (let i = 0; i < 10; i++) {
            this.createPost();
        }
    }

    createPost() {
        const post = {
            id: this.idPosts,
            author_id: faker.datatype.number(),
            title: faker.lorem.sentence(),
            author: faker.name.findName(),
            avatar: faker.image.avatar(),
            image: faker.image.image(),
            created: Date.now(),

        }
        this.idPosts++;
        this.posts.push(post);

        this.createComments(post.id)
    }

    createComments(id) {
        for (let i = 0; i < 3; i++) {
            this.createComment(id);
        }
    }

    createComment(id) {
        const comment = {
            id: faker.datatype.number(),
            post_id: id,
            author_id: faker.datatype.number(),
            author: faker.name.findName(),
            avatar: faker.image.avatar(),
            content: faker.lorem.sentence(),
            created: Date.now(),
        }
        this.comments.push(comment);
    }

    createTimers() {
        this.timerPost = setInterval(() => this.createPost(), 60000);
        this.timerComment = setInterval(() => this.createComment(Math.floor(Math.random() * this.idPosts)), 30000);
    }

    getLastPosts() {
        return this.posts.slice(-10);
    }

    getLastComments(id) {
        return this.comments.filter(item => item.post_id === id)
                            .sort((a, b) => a.created - b.created)
                            .slice(-3);
    }
}

module.exports = {
    ArrPosts,
}