model example {
    field id fid: string
}

coleslawDynamo
    .create(options, example)
    .example
    .createTable()

done()