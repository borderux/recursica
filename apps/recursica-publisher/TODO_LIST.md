# TODO List

1. Instance table in our fimga.json has strange values for cProps
2. libraries key in our exported json has a libNm and a key. Not sure we should have that. We don't care about libraries
3. We have \_unhandledKeys with \_unknownType. Should we even include unhandled keys, since its not useful. Also, \_unknownType is useless
4. If we publish a component, I'm not going to update the metadata because we don't know if that component actually gets merged in. Therefore, we publish to a branch, and once its merged in, we can then import that component again and replace the existing version with the new version with an updated revision.
5. We have an issue if the user has imported multiple of the same component in the same file, which can easily happen when importing because we create a copy. Should we allow users to do this. The problem is importing another component that has a dependency on that component (that has multiple instances), we are not sure which component to resolve our instance refs to
6.
