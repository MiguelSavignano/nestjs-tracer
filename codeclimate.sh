# CC_TEST_REPORTER_ID
~/bin/cc-test-reporter format-coverage -t lcov -o codeclimate.json coverage/lcov.info
~/bin/cc-test-reporter upload-coverage -i codeclimate.json
