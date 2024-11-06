import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    color: '#11183C',
    borderColor: '#2F66F6',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 11,
    backgroundColor: '#ffffff',
    paddingTop: 10,
    paddingBottom: 10,
    alignContent: 'center',
    justifyContent: 'center',
  },
  input: {
    fontFamily: 'ReadexPro_400Regular',
    minHeight: 28,
    color: '#11183C',
    paddingVertical: 0,
    flex: 1,
    zIndex: 10,
  },
  img: {
    height: 25,
    width: 25,
    alignSelf: 'center',
  },
  toggleButton: {
    zIndex: 11,
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
  countdown: {
    position: 'absolute',
    right: 11,
    bottom: 0,
    color: '#49658c',
    fontSize: 10,
  },
});
