import * as protoLoader from '@grpc/proto-loader'
import * as grpc from '@grpc/grpc-js'
import path from 'path'

const PROTO_PATH = path.resolve(__dirname, '../../../protos/auth.proto')
const pkgDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

const protoDescriptor = grpc.loadPackageDefinition(pkgDef)

export const protos =  {
  // eslint-disable-next-line
  authProto: protoDescriptor.auth!.AuthService,
}
