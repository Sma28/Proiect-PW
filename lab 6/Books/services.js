const {
    Books
} = require('../data');

const add = async (name, authorId, genres) => {
    const author = new Books({
        name,
        author: authorId,
        genres
    });
    await author.save();
};

const getAll = async () => {
    const books = await Books.find().populate('author');
    return books.map(book => {
        const {
            id,
            name,
            genres
        } = book;
        return {
            id,
            name,
            genres,
            author //:`${book.author.firstName} ${book.author.lastName}`
        }
    })
};

const getById = async (id) => {
    const book = await Books.findById(id).populate('author');
    const {
        name,
        genres
    } = book;
    return {
        id,
        name,
        genres,
        author: `${book.author.firstName} ${book.author.lastName}`
    }
};

const getByAuthorId = async (id) => {
    const books = await Books.find({author: id});
    return books.map(book => {
        const {
            id,
            name,
            genres
        } = book;
        return {
            id,
            name,
            genres
        }
    })
};

const updateById = async (id, name, authorId, genres) => {
    await Books.findByIdAndUpdate(id, {
        name,
        authorId,
        genres
    });
};

const deleteById = async (id) => {
    await Books.findByIdAndDelete(id);
};



module.exports = {
    add,
    getAll,
    getById,
    getByAuthorId,
    updateById,
    deleteById
}