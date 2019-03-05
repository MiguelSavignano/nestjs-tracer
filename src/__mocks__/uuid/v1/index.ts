let uuidv1 = jest.genMockFromModule("uuid/v1");

uuidv1 = jest.fn(() => "UUID_MOCK");

module.exports = uuidv1;
