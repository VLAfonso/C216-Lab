export const MAX_LENGTH = 255;

export function validateBook({ name, author, publisher }) {
  const errors = {};

  const trimmedName = name.trim();
  const trimmedAuthor = author.trim();
  const trimmedPublisher = publisher.trim();

  if (!trimmedName) {
    errors.name = "O nome do livro é obrigatório.";
  } else if (trimmedName.length > MAX_LENGTH) {
    errors.name = `O nome do livro deve ter no máximo ${MAX_LENGTH} caracteres.`;
  }

  if (!trimmedAuthor) {
    errors.author = "O autor é obrigatório.";
  } else if (trimmedAuthor.length > MAX_LENGTH) {
    errors.author = `O nome do autor deve ter no máximo ${MAX_LENGTH} caracteres.`;
  }

  if (!trimmedPublisher) {
    errors.publisher = "A editora é obrigatória.";
  } else if (trimmedPublisher.length > MAX_LENGTH) {
    errors.publisher = `O nome da editora deve ter no máximo ${MAX_LENGTH} caracteres.`;
  }

  return {
    errors,
    values: {
      name: trimmedName,
      author: trimmedAuthor,
      publisher: trimmedPublisher,
    },
  };
}
